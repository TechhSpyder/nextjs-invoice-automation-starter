import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/**
 * POST /api/extract
 *
 * Accepts a PDF file upload, sends it to PDFBridge for direct
 * AI invoice extraction, and returns the structured InvoiceExtractionResult.
 *
 * This runs on the server — your PDFBRIDGE_API_KEY is never exposed to the browser.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.PDFBRIDGE_API_KEY;
  const baseUrl =
    process.env.PDFBRIDGE_BASE_URL ?? "https://api.pdfbridge.xyz/api/v1";

  if (!apiKey) {
    return NextResponse.json(
      { error: "PDFBRIDGE_API_KEY is not set. Check your .env.local file." },
      { status: 500 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload a valid PDF file." },
        { status: 400 },
      );
    }

    // Step 1: Submit DIRECTLY to PDFBridge /extract endpoint
    // This accepts the PDF file directly, bypassing Gotenberg rendering
    const pdfBlob = new Blob([await file.arrayBuffer()], {
      type: "application/pdf",
    });
    const extractFormData = new FormData();
    extractFormData.append("file", pdfBlob, file.name);

    const submitResponse = await fetch(`${baseUrl}/extract`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
      },
      body: extractFormData,
    });

    if (!submitResponse.ok) {
      const err = await submitResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || "Failed to submit to PDFBridge." },
        { status: submitResponse.status },
      );
    }

    const { jobId } = await submitResponse.json();

    // Step 2: Poll for the job result (max 30 attempts × 1s = 30s)
    for (let attempt = 0; attempt < 30; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const statusResponse = await fetch(`${baseUrl}/jobs/${jobId}`, {
        headers: { "x-api-key": apiKey },
      });

      if (!statusResponse.ok) continue;

      const job = await statusResponse.json();

      // The API returns 'status' as 'SUCCESS', 'FAILED', 'PENDING', or 'PROCESSING'
      const status = job.status?.toUpperCase();

      if (status === "SUCCESS" || status === "DONE") {
        return NextResponse.json({
          jobId,
          pdfUrl: job.result?.url || job.url,
          aiMetadata: job.result?.aiMetadata || job.aiMetadata || null,
        });
      }

      if (status === "FAILED") {
        return NextResponse.json(
          { error: job.result?.error || "Job failed during processing." },
          { status: 422 },
        );
      }
    }

    return NextResponse.json(
      { error: "Job timed out after 30 seconds. Please try again." },
      { status: 504 },
    );
  } catch (err: any) {
    console.error("[extract] Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
