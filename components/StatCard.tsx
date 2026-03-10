export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: any;
  trend: string;
}) {
  const isUp = trend.startsWith("+");
  return (
    <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-1 hover:border-slate-700 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
          {title}
        </span>
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black">{value}</span>
        <span
          className={`text-[10px] font-bold ${isUp ? "text-emerald-400" : "text-red-400"}`}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
