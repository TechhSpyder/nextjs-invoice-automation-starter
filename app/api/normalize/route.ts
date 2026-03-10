import { NextRequest, NextResponse } from "next/server";
import { PDFBridge, PDFBridgeError } from "@techhspyder/pdfbridge-node";

export const maxDuration = 60;

/**
 * POST /api/normalize
 *
 * Uses the official PDFBridge SDK's "Closed-Loop" orchestrator (normalizeInvoice).
 * It extracts data AND regenerates a professional PDF in one workflow.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.PDFBRIDGE_API_KEY;
  const baseUrl = process.env.PDFBRIDGE_BASE_URL;

  if (!apiKey) {
    return NextResponse.json(
      { error: "PDFBRIDGE_API_KEY is not set." },
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

    // Use the official SDK's "Closed-Loop" orchestrator (normalizeInvoice).
    // In Edge runtimes, we pass the Uint8Array directly
    const buffer = new Uint8Array(await file.arrayBuffer());

    // Call the orchestrator with the raw file buffer
    const response = await client.normalizeInvoice({
      file: buffer,
      filename: file.name,
    });

    const jobId = response.jobId;

    // Poll for completion
    while (true) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const job = await client.getJob(jobId);

      if (job.status === "COMPLETED") {
        return NextResponse.json({
          jobId: job.id,
          pdfUrl: job.result?.url || job.pdfUrl,
          aiMetadata: job.result?.aiMetadata || job.aiMetadata || null,
        });
      }

      if (job.status === "FAILED") {
        return NextResponse.json(
          { error: job.error || "Normalization failed." },
          { status: 422 },
        );
      }
    }
  } catch (err: any) {
    console.error("[normalize] Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
