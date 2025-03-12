import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET endpoint to fetch a specific company detail by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid company details ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "create-table");

    const companyDetails = await db.collection("company-details").findOne({
      _id: new ObjectId(id),
    });

    if (!companyDetails) {
      return NextResponse.json(
        { error: "Company details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: companyDetails,
    });
  } catch (error) {
    console.error("[Company Details API] Fetch by ID error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company details" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove company details
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid company details ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "create-table");

    const result = await db.collection("company-details").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Company details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Company details deleted successfully",
    });
  } catch (error) {
    console.error("[Company Details API] Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete company details" },
      { status: 500 }
    );
  }
} 