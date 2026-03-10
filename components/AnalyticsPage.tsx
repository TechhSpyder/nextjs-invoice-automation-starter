import React from "react";
import { AnalyticsHeaderClient } from "./AnalyticsHeaderClient";
import { StatCard } from "./StatCard";
import {
  BarChart3,
  Calendar,
  DollarSign,
  PieChartIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { RegionProgress } from "./RegionProgress";

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <AnalyticsHeaderClient />

      {/* Dashboard Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$428,500"
          icon={DollarSign}
          trend="+12.5%"
        />
        <StatCard
          title="Active Users"
          value="12,402"
          icon={Users}
          trend="+8.2%"
        />
        <StatCard
          title="Conversion Rate"
          value="3.42%"
          icon={TrendingUp}
          trend="+2.1%"
        />
        <StatCard
          title="Avg. Ticket"
          value="$84.50"
          icon={Calendar}
          trend="-1.2%"
        />
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
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                Growth
              </span>
            </div>
          </div>
          <div className="h-[240px] flex items-end justify-between gap-4 px-2">
            {[40, 65, 45, 90, 75, 100].map((h, i) => (
              <div
                key={i}
                className="w-full h-full bg-slate-800/20 rounded-t-lg relative group overflow-hidden"
              >
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
            <RegionProgress
              name="North America"
              percent={65}
              color="bg-blue-500"
            />
            <RegionProgress name="Europe" percent={20} color="bg-purple-500" />
            <RegionProgress
              name="Asia Pacific"
              percent={10}
              color="bg-emerald-500"
            />
            <RegionProgress name="Other" percent={5} color="bg-slate-600" />
          </div>
        </div>
      </div>

      {/* Action / Explanation Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
        <div className="max-w-xl space-y-4">
          <h2 className="text-xl font-bold tracking-tight">
            What makes this report special?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Generating dashboard reports as PDFs is notoriously difficult.
            Puppeteer often struggles with JS-rendered charts and multi-page
            layout breaks.
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
  );
}
