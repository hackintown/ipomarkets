import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET endpoint to fetch public company details by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid company ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "create-table");

    // First, check if this is a company ID from table data
    const tableData = await db.collection("tableData").findOne({
      _id: new ObjectId(id),
    });

    if (!tableData) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Find company details using the company ID
    const companyDetails = await db.collection("company-details").findOne({
      companyId: id,
    });

    if (!companyDetails) {
      // If no detailed profile exists, return basic company data
      return NextResponse.json({
        success: true,
        data: {
          _id: tableData._id,
          name: tableData.data[Object.keys(tableData.data)[0]] || "Unnamed Company",
          basicData: tableData.data,
          hasDetailedProfile: false,
        },
      });
    }

    // Return full company details
    return NextResponse.json({
      success: true,
      data: {
        ...companyDetails,
        hasDetailedProfile: true,
      },
    });
  } catch (error) {
    console.error("[Public Company API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company details" },
      { status: 500 }
    );
  }
} 