"use client";

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Download, 
  Loader2,
  Calendar,
  ChevronRight,
  PieChart as PieChartIcon
} from "lucide-react";

export default function AnalyticsReportPage() {
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
      alert("Failed to generate report. Make sure your API key is correctly set in .env.local");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end pb-8 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Performance Report</h1>
            <p className="text-slate-400 mt-1">Q1 FY2026 · Compiled on March 9, 2026</p>
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
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-emerald-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium">Your PDF report is ready!</span>
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

        {/* Dashboard Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Revenue" value="$428,500" icon={DollarSign} trend="+12.5%" />
          <StatCard title="Active Users" value="12,402" icon={Users} trend="+8.2%" />
          <StatCard title="Conversion Rate" value="3.42%" icon={TrendingUp} trend="+2.1%" />
          <StatCard title="Avg. Ticket" value="$84.50" icon={Calendar} trend="-1.2%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Revenue Growth (Trailing 6 Mo)
              </h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Growth</span>
              </div>
            </div>
            <div className="h-[240px] flex items-end justify-between gap-4 px-2">
              {[40, 65, 45, 90, 75, 100].map((h, i) => (
                <div key={i} className="w-full h-full bg-slate-800/20 rounded-t-lg relative group overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg transition-all duration-700 shadow-[0_-4px_12px_-2px_rgba(37,99,235,0.4)]"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest px-2">
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-6">
             <h3 className="font-bold text-lg flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-purple-400" />
                Revenue by Region
              </h3>
              <div className="space-y-4">
                <RegionProgress name="North America" percent={65} color="bg-blue-500" />
                <RegionProgress name="Europe" percent={20} color="bg-purple-500" />
                <RegionProgress name="Asia Pacific" percent={10} color="bg-emerald-500" />
                <RegionProgress name="Other" percent={5} color="bg-slate-600" />
              </div>
          </div>
        </div>

        {/* Action / Explanation Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
          <div className="max-w-xl space-y-4">
            <h2 className="text-xl font-bold tracking-tight">What makes this report special?</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generating dashboard reports as PDFs is notoriously difficult. Puppeteer often struggles with JS-rendered charts and multi-page layout breaks.
            </p>
            <ul className="space-y-2 text-sm">
               <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Pixel-perfect charts rendered via PDFBridge headless engine.
               </li>
               <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Optimized for printing with specific media-print styles.
               </li>
               <li className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Stateless compute — no local browser memory leaks.
               </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string; value: string; icon: any; trend: string }) {
  const isUp = trend.startsWith("+");
  return (
    <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1 hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">{title}</span>
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black">{value}</span>
        <span className={`text-[10px] font-bold ${isUp ? "text-emerald-400" : "text-red-400"}`}>{trend}</span>
      </div>
    </div>
  );
}

function RegionProgress({ name, percent, color }: { name: string; percent: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-500">{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
