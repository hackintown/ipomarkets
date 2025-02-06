import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";

const tableSchema = z.object({
  tableName: z.string().min(3),
  description: z.string().min(10),
  columns: z.array(z.object({
    name: z.string().min(2),
    type: z.enum(["text", "number", "date", "select", "boolean"]),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })).min(1),
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const validatedData = tableSchema.parse(data);

    const client = await clientPromise;
    const db = client.db("create-table");
    

    // Add timestamps
    const tableData = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection("tables").insertOne(tableData);
    
    if (!result.acknowledged) {
      throw new Error("Failed to create table");
    }
    
    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: "Table created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating table:", error);
    
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
      { error: "Failed to create table" },
      { status: 500 }
    );
  }
}