import { NextRequest, NextResponse } from "next/server";
import { PDFBridge, PDFBridgeError } from "@techhspyder/pdfbridge-node";

export const maxDuration = 60;

/**
 * POST /api/extract
 *
 * Uses the official PDFBridge SDK to extract structured AI data from a PDF.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.PDFBRIDGE_API_KEY;
  const baseUrl = process.env.PDFBRIDGE_BASE_URL;

  if (!apiKey) {
    return NextResponse.json(
      { error: "PDFBRIDGE_API_KEY is not set. Check your .env.local file." },
      { status: 500 },
    );
  }

  const client = new PDFBridge({ apiKey, baseUrl });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload a valid PDF file." },
        { status: 400 },
      );
    }

    // The Next.js formData.get() already returns a standard Web API File object.
    // The SDK natively accepts File | Blob.
    const job = await client.extractAndWait(file, {
      filename: file.name,
    });

    return NextResponse.json({
      jobId: job.id,
      aiMetadata: job.aiMetadata || null,
    });
  } catch (err: any) {
    console.error("[extract] Error:", err);

    if (err instanceof PDFBridgeError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.statusCode || 500 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
