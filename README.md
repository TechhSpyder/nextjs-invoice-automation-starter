# Next.js Invoice & Financial PDF Starter

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTechhSpyder%2Fnextjs-invoice-pdf-starter&env=PDFBRIDGE_API_KEY)

The definitive starter kit for building SaaS billing systems, automated invoice processing, and professional financial exports with Next.js 15 and [PDFBridge](https://pdfbridge.xyz).

## ✨ Key Features

-   **Zero-Config PDF Extraction**: Extract vendors, line items, and taxes with 99% accuracy.
-   **Enterprise Analytics Reports**: Generate multi-page, chart-rich financial exports that look pixel-perfect.
-   **Smart Normalization**: Automatically convert "messy" legacy PDFs into crisp, branded professional invoices.
-   **Human-in-the-Loop Ready**: Built-in `requiresReview` flags for edge-case handling.
-   **Enterprise-Grade Performance**: Sub-3-second processing for multi-page documents.

## 🛠️ Quickstart

**1. Setup Environment**

```bash
git clone https://github.com/TechhSpyder/nextjs-invoice-automation-starter
cd nextjs-invoice-automation-starter
npm install
cp .env.example .env.local
```

**2. Configure API Key**

Get your free key at [pdfbridge.xyz](https://pdfbridge.xyz) and add it to `.env.local`:

```env
PDFBRIDGE_API_KEY=pk_live_...
```

**3. Launch Dev Server**

```bash
npm run dev
```

## 📈 Why This Exists (The Problem)

Developers often reach for **Puppeteer** or **wkhtmltopdf** for invoice generation. In production, this creates three massive headaches:

1.  **Resource Exhaustion**: Chrome uses 512MB+ RAM per instance. 10 users = Server Crash.
2.  **Layout Fragility**: CSS support in older PDF engines is broken. Tailwind usually fails.
3.  **Schema Chaos**: Every vendor has a different invoice layout, making automated entry impossible.

**PDFBridge** solves this by providing a managed rendering layer that speaks "Next.js" — standard HTML/Tailwind in, structured JSON or pixel-perfect PDF out.

## 🧱 Extending This Starter

This repo is a foundation. Here’s how to turn it into a full product:

-   [ ] **Database Sync**: Use Prisma to save extracted invoices to Postgres.
-   [ ] **Billing Portal**: Integrate Stripe to mark extracted invoices as "Paid".
-   [ ] **Batch Processing**: Use the PDFBridge Webhook system for bulk uploads.
-   [ ] **Email Workflow**: Send normalized PDFs to customers via Resend.

## 📄 License

MIT - Feel free to use this in your commercial products!
