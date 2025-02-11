import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";

/**
 * Schema definition for table creation and validation
 */
const tableSchema = z.object({
  tableName: z.string().min(3, "Table name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  columns: z.array(z.object({
    name: z.string().min(2, "Column name must be at least 2 characters"),
    type: z.enum([
      "text", "number", "date", "select", "boolean",
      "email", "url", "phone", "textarea", "richtext"
    ]),
    required: z.boolean(),
    unique: z.boolean().optional(),
    defaultValue: z.string().optional(),
    placeholder: z.string().optional(),
    options: z.array(z.string()).optional(),
    validation: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    }).optional(),
  })).min(1, "At least one column is required"),
  settings: z.object({
    sortable: z.boolean(),
    filterable: z.boolean(),
    searchable: z.boolean(),
    pagination: z.boolean(),
    itemsPerPage: z.number().min(1),
    exportable: z.boolean(),
  }),
});

/**
 * GET endpoint to fetch all tables
 * @returns NextResponse with array of tables or error message
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("create-table");

    // Fetch tables with sorting by creation date
    const tables = await db.collection("tables")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: tables,
      count: tables.length
    });
  } catch (error) {
    console.error("[Tables API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint to create a new table
 * @param request - Contains table configuration in request body
 * @returns NextResponse with created table data or error message
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate request data against schema
    const validatedData = tableSchema.parse(data);

    const client = await clientPromise;
    const db = client.db("create-table");

    // Check if table name already exists
    const existingTable = await db.collection("tables").findOne({
      tableName: validatedData.tableName
    });

    if (existingTable) {
      return NextResponse.json(
        { error: "Table name already exists" },
        { status: 400 }
      );
    }

    // Prepare table data with metadata
    const tableData = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert new table
    const result = await db.collection("tables").insertOne(tableData);

    if (!result.acknowledged) {
      throw new Error("Failed to create table");
    }

    return NextResponse.json({
      success: true,
      data: { ...tableData, _id: result.insertedId },
      message: "Table created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("[Tables API] Create error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create table" },
      { status: 500 }
    );
  }
} 