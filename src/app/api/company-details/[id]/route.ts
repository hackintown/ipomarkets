import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * GET endpoint to fetch a specific company detail by ID
 *
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the company ID
 * @returns JSON response with company details or error
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);

    // Validate MongoDB ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid company details ID format" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "ipomarketsdb");

    // Query for company details with projection to exclude unnecessary fields if needed
    const companyDetails = await db.collection("company-details").findOne(
      { _id: new ObjectId(id) }
      // Add projection here if you want to limit returned fields
      // { projection: { field1: 1, field2: 1 } }
    );

    // Handle case when no company is found
    if (!companyDetails) {
      return NextResponse.json(
        { error: "Company details not found" },
        { status: 404 }
      );
    }

    // Return successful response with data
    return NextResponse.json({
      success: true,
      data: companyDetails,
    });
  } catch (error) {
    // Log error with additional context for debugging
    console.error(
      `[Company Details API] Fetch by ID error for ID ${(await params)?.id}:`,
      error
    );

    // Return generic error to client
    return NextResponse.json(
      { error: "Failed to fetch company details" },
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint to remove company details by ID
 *
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the company ID
 * @returns JSON response with success message or error
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);

    // Validate MongoDB ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid company details ID format" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "ipomarketsdb");

    // Attempt to delete the document
    const result = await db.collection("company-details").deleteOne({
      _id: new ObjectId(id),
    });

    // Check if any document was actually deleted
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Company details not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Company details deleted successfully",
    });
  } catch (error) {
    // Log error with additional context for debugging
    console.error(
      `[Company Details API] Delete error for ID ${(await params)?.id}:`,
      error
    );

    // Return generic error to client
    return NextResponse.json(
      { error: "Failed to delete company details" },
      { status: 500 }
    );
  }
}

/**
 * PUT endpoint to update company details by ID
 *
 * @param request - The incoming HTTP request containing updated company data
 * @param params - Route parameters containing the company ID
 * @returns JSON response with updated company details or error
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await Promise.resolve(params);

    // Check if ID exists
    if (!id) {
      return NextResponse.json(
        { error: "Company details ID is required for updates" },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid company details ID format" },
        { status: 400 }
      );
    }

    // Parse the request body
    const updatedData = await request.json();

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "ipomarketsdb");

    // Remove _id from update data if present to avoid MongoDB errors
    if (updatedData._id) {
      delete updatedData._id;
    }

    // Update the document
    const result = await db.collection("company-details").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedData },
      { returnDocument: "after" } // Return the updated document
    );

    // Check if document was found and updated
    if (!result) {
      return NextResponse.json(
        { error: "Company details not found" },
        { status: 404 }
      );
    }

    // Return success response with updated data
    return NextResponse.json({
      success: true,
      data: result,
      message: "Company details updated successfully",
    });
  } catch (error) {
    // Log error with additional context for debugging
    console.error(
      `[Company Details API] Update error for ID ${(await params)?.id}:`,
      error
    );

    // Return generic error to client
    return NextResponse.json(
      { error: "Failed to update company details" },
      { status: 500 }
    );
  }
}
