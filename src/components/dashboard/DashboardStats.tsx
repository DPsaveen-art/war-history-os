type DashboardStatsProps = {
  totalWars: number;
};

export default function DashboardStats({ totalWars }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Total Wars</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{totalWars}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Storage</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">Local</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Mode</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">Offline-first</p>
      </div>
    </div>
  );
}