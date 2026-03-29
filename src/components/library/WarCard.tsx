import { War } from "@/types/war";
import { formatYears } from "@/lib/utils";
import Link from "next/link";

type WarCardProps = {
  war: War;
};

export default function WarCard({ war }: WarCardProps) {
  return (
    <Link href={`/library/${war.id}`} className="block group mb-4 outline-none">
      <div className="relative rounded-sm border border-military-700 bg-military-900/80 p-5 shadow-lg shadow-black/50 transition-all cursor-pointer backdrop-blur-sm group-hover:bg-military-800 group-hover:border-military-500">
        {/* Tactical Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-military-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-military-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        <h3 className="text-xl font-bold uppercase tracking-wider text-slate-100 group-hover:text-intel-500 transition-colors drop-shadow">{war.title}</h3>
        
        <p className="mt-2 flex items-center text-xs font-mono font-bold text-alert-500/80 uppercase tracking-widest">
          <span>{formatYears(war.startYear, war.endYear)}</span>
          <span className="mx-2 text-military-500">///</span>
          <span>{war.region}</span>
        </p>
        
        <p className="mt-4 text-sm text-slate-400 line-clamp-3 leading-relaxed border-l-2 border-military-700 pl-3">
          {war.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-military-800/50">
          {war.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-sm bg-military-800 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-military-400 border border-military-700 shadow-inner group-hover:border-military-600 transition-colors"
            >
              [{tag}]
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}