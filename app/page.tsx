"use client";

import { useState, useCallback, useRef } from "react";
import {
  FileText,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

interface LineItem {
  description: string;
  quantity: number | null;
  unitPrice: number | null;
  totalPrice: number | null;
}

interface InvoiceResult {
  jobId: string;
  pdfUrl: string | null;
  aiMetadata: {
    extractionVersion: string;
    requiresReview: boolean;
    processedAt: string;
    documentType: string;
    vendorName: string | null;
    customerName: string | null;
    invoiceNumber: string | null;
    date: string | null;
    totalAmount: number | null;
    taxAmount: number | null;
    currency: string | null;
    lineItems: LineItem[];
    summary: string;
    tags: string[];
  } | null;
}

function Badge({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const colors = {
    default: "bg-slate-700/60 text-slate-300",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[variant]}`}
    >
      {label}
    </span>
  );
}

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-800/60 last:border-0">
      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
        {label}
      </span>
      <span className="text-sm text-slate-200 font-mono">
        {value ?? <span className="text-slate-600 italic">null</span>}
      </span>
    </div>
  );
}

function JsonBlock({ data }: { data: object }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
      >
        {open ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
        {open ? "Hide" : "View"} raw JSON
      </button>
      {open && (
        <pre className="mt-2 p-4 bg-black/40 rounded-xl border border-slate-800 text-xs text-emerald-400 overflow-x-auto font-mono leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function HomePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InvoiceResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Extraction failed.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const meta = result?.aiMetadata;

  return (
    <main className="min-h-screen px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase mb-2">
            <FileText className="w-3 h-3" />
            PDFBridge · Invoice Automation Starter
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Upload an Invoice.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Get Structured JSON.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Drop any invoice PDF below. PDFBridge extracts vendor, line items,
            totals, and currency — guaranteed same schema every time.
          </p>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-blue-500 bg-blue-500/5"
              : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/30"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) processFile(file);
            }}
          />

          {isLoading ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
              <div className="text-center">
                <p className="text-slate-300 font-medium">
                  Extracting invoice data…
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  This usually takes 2–5 seconds
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-semibold">
                  {fileName
                    ? `Re-upload or drop another PDF`
                    : `Drop your invoice PDF here`}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  or click to browse · PDF only
                </p>
              </div>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && meta && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {/* Status Bar */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-3">
                {meta.requiresReview ? (
                  <XCircle className="w-5 h-5 text-amber-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
                <div>
                  <p className="text-sm font-semibold text-white">
                    {meta.requiresReview
                      ? "Needs Review"
                      : "Extraction Complete"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Schema v{meta.extractionVersion} ·{" "}
                    {new Date(meta.processedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge label={meta.documentType} />
                {meta.requiresReview && (
                  <Badge label="Review Required" variant="warning" />
                )}
                {result.pdfUrl && (
                  <a
                    href={result.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    View PDF <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-1">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Financial Summary
              </h2>
              <MetaRow label="Vendor" value={meta.vendorName} />
              <MetaRow label="Bill To" value={meta.customerName} />
              <MetaRow label="Invoice #" value={meta.invoiceNumber} />
              <MetaRow label="Date" value={meta.date} />
              <MetaRow label="Currency" value={meta.currency} />
              <MetaRow
                label="Total Amount"
                value={
                  meta.totalAmount != null
                    ? `${meta.currency ?? ""} ${meta.totalAmount.toFixed(2)}`
                    : null
                }
              />
              <MetaRow
                label="Tax Amount"
                value={
                  meta.taxAmount != null
                    ? `${meta.currency ?? ""} ${meta.taxAmount.toFixed(2)}`
                    : null
                }
              />
            </div>

            {/* Line Items */}
            {meta.lineItems.length > 0 && (
              <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Line Items
                </h2>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-xs text-slate-500 uppercase tracking-wider font-medium pb-2 border-b border-slate-800">
                    <span className="col-span-6">Description</span>
                    <span className="col-span-2 text-right">Qty</span>
                    <span className="col-span-2 text-right">Unit</span>
                    <span className="col-span-2 text-right">Total</span>
                  </div>
                  {meta.lineItems.map((item, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-2 text-sm py-2 border-b border-slate-800/40 last:border-0"
                    >
                      <span className="col-span-6 text-slate-300">
                        {item.description}
                      </span>
                      <span className="col-span-2 text-right text-slate-400 font-mono">
                        {item.quantity ?? "—"}
                      </span>
                      <span className="col-span-2 text-right text-slate-400 font-mono">
                        {item.unitPrice != null
                          ? item.unitPrice.toFixed(2)
                          : "—"}
                      </span>
                      <span className="col-span-2 text-right text-slate-200 font-mono font-semibold">
                        {item.totalPrice != null
                          ? item.totalPrice.toFixed(2)
                          : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary & Tags */}
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Summary
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {meta.summary}
              </p>
              {meta.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {meta.tags.map((tag) => (
                    <Badge key={tag} label={tag} />
                  ))}
                </div>
              )}
            </div>

            {/* Raw JSON toggle */}
            <JsonBlock data={meta} />
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 pt-4">
          Powered by{" "}
          <a
            href="https://pdfbridge.xyz"
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
          >
            PDFBridge
          </a>{" "}
          · Your PDF is processed server-side and never stored.
        </p>
      </div>
    </main>
  );
}
