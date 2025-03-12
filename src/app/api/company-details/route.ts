import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

// Validation schema for company details
const companyDetailsSchema = z.object({
    companyId: z.string(),
    tableId: z.string(),
    companyName: z.string(),
    basicInfo: z.object({
        description: z.string(),
        industry: z.string(),
        founded: z.string(),
        headquarters: z.string(),
        ceo: z.string(),
        employees: z.string(),
        website: z.string(),
    }),
    logo: z.object({
        url: z.string(),
        alt: z.string(),
    }),
    images: z.array(
        z.object({
            url: z.string(),
            caption: z.string(),
        })
    ),
    tables: z.array(
        z.object({
            title: z.string(),
            data: z.array(z.record(z.any())),
        })
    ),
    links: z.array(
        z.object({
            title: z.string(),
            url: z.string(),
            type: z.string(),
        })
    ),
    content: z.array(
        z.object({
            title: z.string(),
            body: z.string(),
            order: z.number(),
        })
    ),
});

// GET endpoint to fetch all company details
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get("companyId");

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB_NAME || "create-table");

        // If companyId is provided, fetch specific company details
        if (companyId) {
            if (!ObjectId.isValid(companyId)) {
                return NextResponse.json(
                    { error: "Invalid company ID format" },
                    { status: 400 }
                );
            }

            const companyDetails = await db.collection("company-details").findOne({
                companyId: companyId
            });

            if (!companyDetails) {
                return NextResponse.json(
                    { error: "Company details not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: companyDetails
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
            count: companyDetails.length
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
        const db = client.db(process.env.MONGODB_DB_NAME || "create-table");

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

        // Add timestamps
        const companyData = {
            ...validatedData,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection("company-details").insertOne(companyData);

        return NextResponse.json({
            success: true,
            data: { ...companyData, _id: result.insertedId },
            message: "Company details created successfully",
        }, { status: 201 });
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
        const db = client.db(process.env.MONGODB_DB_NAME || "create-table");

        // Update with new timestamp
        const updateData = {
            ...validatedData,
            updatedAt: new Date(),
        };

        // Remove _id from the update data
        const { _id, ...dataWithoutId } = updateData;

        const result = await db.collection("company-details").updateOne(
            { _id: new ObjectId(String(_id)) },
            { $set: dataWithoutId }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Company details not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
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