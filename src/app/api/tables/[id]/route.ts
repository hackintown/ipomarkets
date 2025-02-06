import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

const tableSchema = z.object({
    tableName: z.string().min(3, "Table name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    columns: z.array(z.object({
        name: z.string().min(2, "Column name must be at least 2 characters"),
        type: z.enum(["text", "number", "date", "select", "boolean", "email", "url", "phone", "textarea", "richtext"]),
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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid table ID format" },
                { status: 400 }
            );
        }

        const data = await request.json();
        const validatedData = tableSchema.parse(data);

        const client = await clientPromise;
        const db = client.db("create-table");

        const tableData = {
            ...validatedData,
            updatedAt: new Date(),
        };

        const result = await db.collection("tables").updateOne(
            { _id: new ObjectId(id) },
            { $set: tableData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Table not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Table updated successfully"
        });

    } catch (error) {
        console.error("Error updating table:", error);

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
            { error: "Failed to update table" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid table ID format" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("create-table");

        const table = await db.collection("tables").findOne({
            _id: new ObjectId(id)
        });

        if (!table) {
            return NextResponse.json(
                { error: "Table not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(table);
    } catch (error) {
        console.error("Error fetching table:", error);
        return NextResponse.json(
            { error: "Failed to fetch table" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(params);

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid table ID format" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("create-table");

        const result = await db.collection("tables").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Table not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            success: true,
            message: "Table deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting table:", error);
        return NextResponse.json(
            { error: "Failed to delete table" },
            { status: 500 }
        );
    }
} 