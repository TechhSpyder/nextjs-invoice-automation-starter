export function RegionProgress({
  name,
  percent,
  color,
}: {
  name: string;
  percent: number;
  color: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-500">{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
