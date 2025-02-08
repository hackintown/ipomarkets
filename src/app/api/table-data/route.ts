import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST - Create new table data entry
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("create-table");

    // Insert the data
    const result = await db.collection("table-data").insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating table data:", error);
    return NextResponse.json(
      { error: "Failed to create table data" },
      { status: 500 }
    );
  }
}

// GET - Fetch table data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get("tableId");

    if (!tableId) {
      return NextResponse.json(
        { error: "Table ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("create-table");

    const data = await db
      .collection("table-data")
      .find({ tableId: new ObjectId(tableId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching table data:", error);
    return NextResponse.json(
      { error: "Failed to fetch table data" },
      { status: 500 }
    );
  }
}
