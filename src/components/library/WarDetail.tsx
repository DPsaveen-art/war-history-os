import { War } from "@/types/war";

type WarDetailProps = {
  war: War;
};

export default function WarDetail({ war }: WarDetailProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{war.title}</h2>
        <p className="mt-2 text-sm text-slate-600">{war.summary}</p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">Background</h3>
        <p className="mt-2 text-sm text-slate-600">{war.background}</p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">Trigger Event</h3>
        <p className="mt-2 text-sm text-slate-600">{war.triggerEvent}</p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">Outcome</h3>
        <p className="mt-2 text-sm text-slate-600">{war.outcome}</p>
      </div>
    </div>
  );
}