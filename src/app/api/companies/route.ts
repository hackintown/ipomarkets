import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

    if (!ObjectId.isValid(tableId)) {
      return NextResponse.json(
        { error: "Invalid table ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "ipomarketsdb");

    // Verify table exists
    const table = await db.collection("tables").findOne({
      _id: new ObjectId(tableId),
    });

    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Get the first column name (assuming it's the company name column)
    const nameColumn = table.columns[0]?.name;

    if (!nameColumn) {
      return NextResponse.json(
        { error: "Table has no columns" },
        { status: 400 }
      );
    }

    // Fetch table data and extract company information
    const tableData = await db
      .collection("tableData")
      .find({ tableId: new ObjectId(tableId) })
      .toArray();

    // Transform data to return only company ID and name
    const companies = tableData.map((item) => ({
      _id: item._id.toString(),
      name: item[nameColumn] || "Unnamed Company",
      tableId: tableId,
    }));

    return NextResponse.json({
      success: true,
      data: companies,
      count: companies.length,
    });
  } catch (error) {
    console.error("[Companies API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
