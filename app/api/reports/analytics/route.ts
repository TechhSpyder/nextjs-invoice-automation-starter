import { NextRequest, NextResponse } from "next/server";
import { PDFBridge } from "@techhspyder/pdfbridge-node";

export async function POST(req: NextRequest) {
  const apiKey = process.env.PDFBRIDGE_API_KEY;
  const baseUrl = process.env.PDFBRIDGE_BASE_URL;

  if (!apiKey) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  const client = new PDFBridge({ apiKey, baseUrl });

  try {
    // In a real app, you might fetch data from a DB here.
    // For this starter, we'll generate the PDF from the analytics page itself or a dedicated template.
    
    // We use the 'url' method to demonstrate how PDFBridge handles live pages.
    // In local dev, this would need to hit a tunnel or serve a static HTML.
    // For the starter, we'll construct a simple HTML snippet that matches the report design.
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            .no-print { display: none; }
            body { background: white !important; color: black !important; }
            .card { border: 1px solid #e2e8f0 !important; }
          }
        </style>
      </head>
      <body class="bg-[#020617] text-white p-12">
        <div class="max-w-4xl mx-auto space-y-8">
          <div class="flex justify-between items-end pb-8 border-b border-slate-800">
            <div>
              <h1 class="text-4xl font-black tracking-tight">Financial Performance Report</h1>
              <p class="text-slate-400 mt-1 uppercase text-xs font-bold tracking-widest">Q1 FY2026 · Confidential</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-black text-blue-500">PDFBridge</p>
              <p class="text-[10px] text-slate-500 font-bold uppercase">Analytics Engine</p>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-4">
            <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
               <p class="text-[10px] text-slate-500 uppercase font-bold">Revenue</p>
               <p class="text-xl font-bold">$428,500</p>
            </div>
             <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
               <p class="text-[10px] text-slate-500 uppercase font-bold">Users</p>
               <p class="text-xl font-bold">12,402</p>
            </div>
             <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
               <p class="text-[10px] text-slate-500 uppercase font-bold">Conv. Rate</p>
               <p class="text-xl font-bold">3.42%</p>
            </div>
             <div class="p-4 bg-slate-900 border border-slate-800 rounded-xl">
               <p class="text-[10px] text-slate-500 uppercase font-bold">Avg. Ticket</p>
               <p class="text-xl font-bold">$84.50</p>
            </div>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h3 class="font-bold text-lg mb-8 uppercase tracking-widest text-slate-400">Revenue Growth</h3>
            <div class="h-48 flex items-end justify-between gap-4">
            <div class="h-48 flex items-end justify-between gap-4">
              <div class="flex-1 bg-blue-600 rounded-t-lg" style="height: 40%"></div>
              <div class="flex-1 bg-blue-600 rounded-t-lg" style="height: 65%"></div>
              <div class="flex-1 bg-blue-600 rounded-t-lg" style="height: 45%"></div>
              <div class="flex-1 bg-blue-600 rounded-t-lg" style="height: 90%"></div>
              <div class="flex-1 bg-blue-600 rounded-t-lg" style="height: 75%"></div>
              <div class="flex-1 bg-blue-600 rounded-t-lg" style="height: 100%"></div>
            </div>
            <div class="flex justify-between mt-4 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
              <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-8">
            <div class="space-y-4">
              <h4 class="text-sm font-bold uppercase tracking-widest text-slate-500">Regional Breakdown</h4>
              <div class="space-y-3">
                 <div class="flex justify-between text-xs font-bold"><span>North America</span><span>65%</span></div>
                 <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden leading-none flex"><div class="bg-blue-500 w-[65%]"></div></div>
                 
                 <div class="flex justify-between text-xs font-bold pt-2"><span>Europe</span><span>20%</span></div>
                 <div class="h-2 w-full bg-slate-800 rounded-full overflow-hidden leading-none flex"><div class="bg-purple-500 w-[20%]"></div></div>
              </div>
            </div>
            <div class="p-6 bg-blue-900/10 border border-blue-800/20 rounded-2xl">
              <h4 class="text-sm font-bold uppercase tracking-widest text-blue-400 mb-2">Executive Summary</h4>
              <p class="text-xs text-slate-400 leading-relaxed">
                Q1 performance exceeded targets by 14%. The migration to PDFBridge architecture has reduced document generation latency by 85% and eliminated 100% of Puppeteer-related server crashes.
              </p>
            </div>
          </div>

          <div class="pt-12 border-t border-slate-800 text-[10px] text-slate-600 text-center uppercase tracking-widest font-bold">
            Generated via PDFBridge Stateless Engine · March 2026
          </div>
        </div>
      </body>
      </html>
    `;

    const job = await client.generateAndWait({
      html,
      filename: `performance_report_${Date.now()}.pdf`,
      tailwind: true
    });

    return NextResponse.json({
      pdfUrl: job.result?.url || job.pdfUrl,
      jobId: job.id
    });

  } catch (error: any) {
    console.error("Report PDF Gen Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
