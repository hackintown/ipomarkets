import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
  try {
    const { order } = await request.json();

    if (!Array.isArray(order)) {
      return NextResponse.json(
        { error: "Invalid order format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ipomarketsdb");

    // Update each table's order in the database
    await Promise.all(
      order.map((id, index) =>
        db
          .collection("tables")
          .updateOne({ _id: new ObjectId(id) }, { $set: { order: index } })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Table order updated successfully",
    });
  } catch (error) {
    console.error("Error updating table order:", error);
    return NextResponse.json(
      { error: "Failed to update table order" },
      { status: 500 }
    );
  }
}
