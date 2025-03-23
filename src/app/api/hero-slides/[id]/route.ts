import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

// Type inference from zod schema
type SlideData = z.infer<typeof slideSchema>;

/**
 * Validation schema for hero slide data
 * Defines required fields and their validation rules
 */
const slideSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  tagline: z
    .string()
    .min(1, "Tagline is required")
    .max(200, "Tagline is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  imageUrl: z.string().url("Invalid image URL"),
  ctaLabel: z
    .string()
    .min(1, "CTA Label is required")
    .max(50, "CTA Label is too long"),
  ctaLink: z.string().min(1, "CTA Link is required").url("Invalid CTA URL"),
});

/**
 * GET handler - Retrieves a single hero slide by ID
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await Promise.resolve(params);

  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid slide ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ipomarketsdb");

    const slide = await db.collection("hero-slides").findOne({
      _id: new ObjectId(id),
    });

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json(slide);
  } catch (error) {
    console.error("Error fetching slide:", error);
    return NextResponse.json(
      { error: "Failed to fetch slide" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Updates an existing hero slide
 * Includes validation and proper error handling
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await Promise.resolve(params);

  try {
    // Validate ObjectId format

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid slide ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ipomarketsdb");

    // Parse and validate request body
    const data = await request.json();
    const validatedData: SlideData = slideSchema.parse(data);

    const result = await db.collection("hero-slides").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...validatedData,

          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        projection: {
          // Specify fields to return
          _id: 1,
          title: 1,
          tagline: 1,
          description: 1,
          imageUrl: 1,
          ctaLabel: 1,
          ctaLink: 1,
          updatedAt: 1,
        },
      }
    );

    if (!result) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating slide:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: "Failed to update slide" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Removes a hero slide
 * Includes proper error handling and response formatting
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await Promise.resolve(params);

  try {
    // Validate ObjectId format

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid slide ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("ipomarketsdb");

    const result = await db.collection("hero-slides").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Slide deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting slide:", error);
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 }
    );
  }
}
