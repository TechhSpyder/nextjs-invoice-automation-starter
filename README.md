# Next.js Invoice Automation Starter

A production-ready example showing how to build invoice data extraction into a Next.js app using the [PDFBridge](https://pdfbridge.xyz) API.

**Drop a PDF invoice → get structured JSON back in seconds.**

## What This Does

1. User uploads an invoice PDF via a drag-and-drop UI
2. The file is sent to a Next.js server-side API route (your API key stays safe)
3. PDFBridge converts the PDF and extracts structured invoice data using Gemini Structured Outputs
4. The app displays a clean results view with vendor, line items, totals, and currency

The extracted JSON always follows the same schema — no parsing surprises:

```json
{
  "extractionVersion": "1.0",
  "requiresReview": false,
  "processedAt": "2026-03-04T12:00:00.000Z",
  "documentType": "invoice",
  "vendorName": "Acme Corp",
  "customerName": "TSpyder Inc",
  "invoiceNumber": "INV-2026-001",
  "date": "2026-02-28",
  "totalAmount": 1250.0,
  "taxAmount": 200.0,
  "currency": "USD",
  "lineItems": [
    {
      "description": "Monthly SaaS License",
      "quantity": 5,
      "unitPrice": 210.0,
      "totalPrice": 1050.0
    }
  ],
  "summary": "Invoice from Acme Corp for SaaS licenses.",
  "tags": ["saas", "license", "invoice"]
}
```

## Stack

- [Next.js 15](https://nextjs.org) with App Router
- [PDFBridge API](https://pdfbridge.xyz) for PDF rendering + AI extraction
- TypeScript + Tailwind CSS

## Quickstart

**1. Clone and install**

```bash
git clone https://github.com/TechhSpyder/nextjs-invoice-automation-starter
cd nextjs-invoice-automation-starter
npm install
```

**2. Add your API key**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
PDFBRIDGE_API_KEY=pk_live_your_key_here
```

Get a free API key at [pdfbridge.xyz](https://pdfbridge.xyz) — no credit card required. Free plan includes **5 AI invoice analyses per month**.

**3. Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and drop in an invoice PDF.

## How the Extraction Works

The core is in [`app/api/extract/route.ts`](app/api/extract/route.ts). Instead of converting HTML to PDF, we use the direct `/extract` endpoint which is optimized for existing financial documents:

```typescript
// Step 1: Submit PDF directly to PDFBridge
const formData = new FormData();
formData.append("file", pdfBlob, "invoice.pdf");

const response = await fetch("https://api.pdfbridge.xyz/api/v1/extract", {
  method: "POST",
  headers: { "x-api-key": process.env.PDFBRIDGE_API_KEY },
  body: formData,
});

const { jobId } = await response.json();

// Step 2: Poll for the result (typically 2–5s)
// job.aiMetadata will have the strict schema above
```

## The `requiresReview` Flag

If critical fields like `totalAmount` or `vendorName` are missing or suspect, the API sets `requiresReview: true`. Use this to route incomplete extractions to a human queue:

```typescript
if (job.aiMetadata.requiresReview) {
  await notifyTeam(job); // Route to human review
} else {
  await pushToERP(job.aiMetadata); // Send directly to QuickBooks/Xero/Stripe
}
```

## Deploying to Vercel

```bash
npx vercel
```

Add `PDFBRIDGE_API_KEY` as an environment variable in your Vercel project settings.

## Learn More

- [PDFBridge Documentation](https://pdfbridge.xyz/docs)
- [REST API Reference](https://pdfbridge.xyz/docs/api-reference)
- [Pricing](https://pdfbridge.xyz/#pricing) — Free tier available

## License

MIT
