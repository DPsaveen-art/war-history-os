import { War } from "@/types/war";
import { formatYears } from "@/lib/utils";

type RecentWarsProps = {
  wars: War[];
};

export default function RecentWars({ wars }: RecentWarsProps) {
  return (
    <div className="space-y-3">
      {wars.map((war) => (
        <div key={war.id} className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900">{war.title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {formatYears(war.startYear, war.endYear)}
          </p>
          <p className="mt-2 text-sm text-slate-600">{war.summary}</p>
        </div>
      ))}
    </div>
  );
}