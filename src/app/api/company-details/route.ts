import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

// Custom refinement for ObjectId
const objectIdSchema = z.string().refine(
  (val) => {
    try {
      new ObjectId(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid ObjectId" }
);

// Validation schema for company details
const companyDetailsSchema = z.object({
  _id: objectIdSchema.optional(),
  companyId: z.string(),
  tableId: z.string(),
  companyName: z.string(),
  basicInfo: z
    .object({
      description: z.string().optional().default(""),
      industry: z.string().optional().default(""),
      founded: z.string().optional().default(""),
      headquarters: z.string().optional().default(""),
      ceo: z.string().optional().default(""),
      employees: z.string().optional().default(""),
      website: z.string().optional().default(""),
    })
    .optional()
    .default({}),
  logo: z
    .object({
      url: z.string().optional().default(""),
      alt: z.string().optional().default(""),
    })
    .optional()
    .default({}),
  images: z
    .array(
      z.object({
        url: z.string(),
        caption: z.string(),
      })
    )
    .optional()
    .default([]),
  tables: z
    .array(
      z.object({
        title: z.string(),
        data: z.array(z.record(z.any())),
      })
    )
    .optional()
    .default([]),
  links: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        type: z.string(),
      })
    )
    .optional()
    .default([]),
  content: z
    .array(
      z.object({
        title: z.string(),
        body: z.string(),
        order: z.number(),
      })
    )
    .optional()
    .default([]),
  reviews: z
    .array(
      z.object({
        title: z.string(),
        content: z.string(),
        rating: z.number(),
        author: z.string(),
        date: z.string(),
        type: z.enum(["table", "list", "content"]),
        listItems: z.array(z.string()).optional(),
        tableData: z.array(z.record(z.any())).optional(),
      })
    )
    .optional()
    .default([]),
  news: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        date: z.string(),
        time: z.string(),
        description: z.string(),
        content: z.string(),
        source: z.string(),
        order: z.number(),
      })
    )
    .optional()
    .default([]),
});

// GET endpoint to fetch all company details
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "ipomarketsdb");

    // If companyId is provided, fetch specific company details
    if (companyId) {
      if (!ObjectId.isValid(companyId)) {
        return NextResponse.json(
          { error: "Invalid company ID format" },
          { status: 400 }
        );
      }

      const companyDetails = await db.collection("company-details").findOne({
        companyId: companyId,
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
    }

    // Otherwise, fetch all company details
    const companyDetails = await db
      .collection("company-details")
      .find()
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: companyDetails,
      count: companyDetails.length,
    });
  } catch (error) {
    console.error("[Company Details API] Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch company details" },
      { status: 500 }
    );
  }
}

// POST endpoint to create new company details
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = companyDetailsSchema.parse(data);

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "ipomarketsdb");

    // Check if company details already exist
    const existingDetails = await db.collection("company-details").findOne({
      companyId: validatedData.companyId,
    });

    if (existingDetails) {
      return NextResponse.json(
        { error: "Company details already exist. Use PUT to update." },
        { status: 400 }
      );
    }

    // Remove _id from validated data if it exists
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...companyDataWithoutId } = validatedData;

    // Add timestamps
    const companyData = {
      ...companyDataWithoutId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("company-details")
      .insertOne(companyData);

    return NextResponse.json(
      {
        success: true,
        data: { ...companyData, _id: result.insertedId },
        message: "Company details created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Company Details API] Create error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create company details" },
      { status: 500 }
    );
  }
}

// PUT endpoint to update existing company details
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const validatedData = companyDetailsSchema.parse(data);

    if (!validatedData._id) {
      return NextResponse.json(
        { error: "Company details ID is required for updates" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "ipomarketsdb");

    // Convert string _id to ObjectId
    const _id = new ObjectId(validatedData._id);

    // Remove _id from the update data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: idToRemove, ...updateDataWithoutId } = validatedData;

    // Update with new timestamp
    const updateData = {
      ...updateDataWithoutId,
      updatedAt: new Date(),
    };

    const result = await db
      .collection("company-details")
      .findOneAndUpdate(
        { _id },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (!result) {
      return NextResponse.json(
        { error: "Company details not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Company details updated successfully",
    });
  } catch (error) {
    console.error("[Company Details API] Update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update company details" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove company details
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || "ipomarketsdb");

    const result = await db.collection("company-details").deleteOne({
      companyId: companyId,
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
