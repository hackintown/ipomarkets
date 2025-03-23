import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * POST endpoint to create a new table data entry
 * @param request - Contains tableId and data in the request body
 * @returns NextResponse with the created data or error message
 */
export async function POST(request: Request) {
  try {
    // Extract and validate request body
    const { tableId, data } = await request.json();

    if (!tableId || !data) {
      return NextResponse.json(
        { error: "Table ID and data are required" },
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

    // Verify table existence before inserting data
    const table = await db.collection("tables").findOne({
      _id: new ObjectId(tableId),
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Prepare data with metadata
    const tableData = {
      tableId: new ObjectId(tableId),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert data into collection
    const result = await db.collection("tableData").insertOne(tableData);

    return NextResponse.json(
      {
        success: true,
        data: { ...tableData, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Table Data API] Create error:", error);
    return NextResponse.json(
      { error: "Failed to add table data" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch table data
 * @param request - Contains tableId in query parameters
 * @returns NextResponse with the table data or error message
 */
export async function GET(request: Request) {
  try {
    // Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get("tableId");

    if (!tableId) {
      return NextResponse.json(
        { error: "Table ID is required" },
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

    // Fetch and sort table data
    const data = await db
      .collection("tableData")
      .find({ tableId: new ObjectId(tableId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    console.error("[Table Data API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch table data" },
      { status: 500 }
    );
  }
}
