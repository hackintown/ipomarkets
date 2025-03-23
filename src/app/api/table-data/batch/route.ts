import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Configure request size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Increased for batch imports
    },
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, data, uniqueKeyField, skipDuplicates = false } = body;

    if (!tableId || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        {
          error:
            "Invalid request format. TableId and non-empty data array required.",
        },
        { status: 400 }
      );
    }

    // Validate tableId format
    if (!ObjectId.isValid(tableId)) {
      return NextResponse.json(
        { error: "Invalid table ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "ipomarketsdb");

    // Verify table existence
    const table = await db.collection("tables").findOne({
      _id: new ObjectId(tableId),
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Results tracking
    const results = {
      success: 0,
      skipped: 0,
      failed: 0,
      errors: [] as string[],
      totalRecords: data.length,
    };

    // Check for duplicates if uniqueKeyField is provided
    if (uniqueKeyField) {
      const insertQueue = [];

      // Process each record one by one to check for duplicates
      for (const item of data) {
        try {
          // Skip records without the unique key value
          if (!item[uniqueKeyField]) {
            results.failed++;
            results.errors.push(`Record missing ${uniqueKeyField} value`);
            continue;
          }

          // Check if record already exists
          const existingRecord = await db.collection("tableData").findOne({
            tableId: new ObjectId(tableId),
            [uniqueKeyField]: item[uniqueKeyField],
          });

          if (existingRecord) {
            if (skipDuplicates) {
              results.skipped++;
              continue;
            } else {
              // Return error if not skipping duplicates
              return NextResponse.json(
                {
                  error: "Duplicate records found",
                  message: `Record with ${uniqueKeyField} = ${item[uniqueKeyField]} already exists.`,
                  duplicateCount: 1,
                },
                { status: 409 }
              );
            }
          }

          // Add to insertion queue
          insertQueue.push({
            tableId: new ObjectId(tableId),
            ...item,
            createdAt: new Date(),
            updatedAt: new Date(),
            inputMethod: "excel",
          });
        } catch (error) {
          results.failed++;
          results.errors.push(
            error instanceof Error ? error.message : "Unknown error"
          );
        }
      }

      // Bulk insert records that passed duplicate check
      if (insertQueue.length > 0) {
        const insertResult = await db
          .collection("tableData")
          .insertMany(insertQueue);
        results.success = insertResult.insertedCount;
      }
    } else {
      // If no uniqueKeyField, just insert all records
      const insertData = data.map((item) => ({
        tableId: new ObjectId(tableId),
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
        inputMethod: "excel",
      }));

      const insertResult = await db
        .collection("tableData")
        .insertMany(insertData);
      results.success = insertResult.insertedCount;
    }

    // Log the activity
    await db.collection("activityLogs").insertOne({
      action: "batch_import",
      tableId: new ObjectId(tableId),
      timestamp: new Date(),
      recordCount: results.success,
      skippedCount: results.skipped,
      failedCount: results.failed,
      inputMethod: "excel",
    });

    return NextResponse.json({
      success: true,
      message: `Import completed: ${results.success} added, ${results.skipped} skipped, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error("[Table Data API] Batch import error:", error);
    return NextResponse.json(
      {
        error: "Failed to import data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
