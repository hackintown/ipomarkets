import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { tableId, data } = await request.json();

    if (!tableId || !Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Insert batch
    await db.collection('tableData').insertMany(
      data.map(item => ({
        tableId,
        data: item,
        createdAt: new Date()
      }))
    );

    return NextResponse.json({
      success: true,
      message: `${data.length} records imported successfully`
    });

  } catch (error) {
    console.error("[Table Data API] Batch import error:", error);
    return NextResponse.json(
      { error: "Failed to import data" },
      { status: 500 }
    );
  }
}