"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export function AnalyticsHeaderClient() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setPdfUrl(null);

    try {
      const response = await fetch("/api/reports/analytics", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setPdfUrl(data.pdfUrl);
    } catch (error) {
      console.error("Report generation error:", error);
      alert(
        "Failed to generate report. Make sure your API key is correctly set in .env.local",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-end pb-8 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Financial Performance Report
          </h1>
          <p className="text-slate-400 mt-1">
            Q1 FY2026 · Compiled on March 9, 2026
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isGenerating ? "Generating PDF..." : "Export to PDF"}
        </button>
      </div>

      {pdfUrl && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-emerald-400 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium">
              Your PDF report is ready!
            </span>
          </div>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold underline underline-offset-4 hover:text-white transition-colors"
          >
            Open PDF Report
          </a>
        </div>
      )}
    </>
  );
}
