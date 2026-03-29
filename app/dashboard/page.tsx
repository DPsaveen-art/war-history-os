"use client";

import { useEffect, useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import { getWars } from "@/lib/storage";
import { War } from "@/types/war";
import Link from "next/link";

export default function DashboardPage() {
  const [wars, setWars] = useState<War[]>([]);

  useEffect(() => {
    setWars(getWars());
  }, []);

  const stats = useMemo(() => {
    const total = wars.length;
    const byRegion: Record<string, number> = {};
    const byEra: Record<string, number> = {};
    const incomplete: War[] = [];
    
    // sorting by createdAt (descending), fallback to id if missing
    const recent = [...wars].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    }).slice(0, 5);

    wars.forEach((war) => {
      // Region stats
      if (war.region) {
        byRegion[war.region] = (byRegion[war.region] || 0) + 1;
      }
      
      // Era stats
      if (war.era) {
        byEra[war.era] = (byEra[war.era] || 0) + 1;
      }

      // Check for incomplete (missing core info like dates or summary)
      if (!war.startYear || !war.summary || !war.region) {
        incomplete.push(war);
      }
    });

    return { total, byRegion, byEra, recent, incomplete };
  }, [wars]);

  const StatCard = ({ title, value, subtitle }: { title: string, value: string | number, subtitle?: string }) => (
    <div className="bg-military-900/60 p-6 rounded-sm border border-military-700 shadow-lg backdrop-blur-sm hover:border-military-500 transition-colors group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-military-600 opacity-50 m-2 group-hover:border-intel-500 transition-colors"></div>
      <h3 className="text-[10px] font-black tracking-widest text-military-500 uppercase mb-3 drop-shadow flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-military-500 rounded-full group-hover:bg-intel-500"></span> {title}
      </h3>
      <div className="text-5xl font-black tracking-tighter text-slate-100 drop-shadow-md">{value}</div>
      {subtitle && <p className="text-xs font-mono font-bold text-slate-400 mt-4 border-t border-military-800 pt-3">{subtitle}</p>}
    </div>
  );

  return (
    <AppShell>
      <PageHeader
        title="Dashboard Overview"
        description="A statistical snapshot of your documented historical conflicts."
      />

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
        <StatCard title="Total Wars" value={stats.total} subtitle="Documented conflicts" />
        <StatCard title="Regions Covered" value={Object.keys(stats.byRegion).length} subtitle="Distinct geographic areas" />
        <StatCard title="Eras Covered" value={Object.keys(stats.byEra).length} subtitle="Distinct historical periods" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Regions and Eras */}
        <div className="space-y-8">
          <div className="bg-military-900/40 p-6 rounded-sm border border-military-800 shadow-sm relative">
            <h3 className="text-sm font-black tracking-widest text-slate-300 uppercase mb-5 border-b border-military-700 pb-3">Wars by Region</h3>
            {Object.keys(stats.byRegion).length === 0 ? (
              <p className="text-xs font-mono text-military-500 uppercase">No regions tracked yet.</p>
            ) : (
              <ul className="space-y-3">
                {Object.entries(stats.byRegion).sort((a, b) => b[1] - a[1]).map(([region, count]) => (
                  <li key={region} className="flex justify-between items-center text-sm font-mono border-b border-military-800/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-400 uppercase tracking-widest text-xs">{region}</span>
                    <span className="bg-military-800 text-slate-300 py-1 px-2.5 rounded-sm text-[10px] font-black border border-military-600">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-military-900/40 p-6 rounded-sm border border-military-800 shadow-sm relative">
            <h3 className="text-sm font-black tracking-widest text-slate-300 uppercase mb-5 border-b border-military-700 pb-3">Wars by Era</h3>
            {Object.keys(stats.byEra).length === 0 ? (
              <p className="text-xs font-mono text-military-500 uppercase">No eras tracked yet.</p>
            ) : (
              <ul className="space-y-3">
                {Object.entries(stats.byEra).sort((a, b) => b[1] - a[1]).map(([era, count]) => (
                  <li key={era} className="flex justify-between items-center text-sm font-mono border-b border-military-800/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-400 uppercase tracking-widest text-xs">{era}</span>
                    <span className="bg-military-800 text-slate-300 py-1 px-2.5 rounded-sm text-[10px] font-black border border-military-600">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent & Incomplete */}
        <div className="space-y-8">
          <div className="bg-military-900/40 p-6 rounded-sm border border-military-800 shadow-sm relative">
            <h3 className="text-sm font-black tracking-widest text-slate-300 uppercase mb-5 border-b border-military-700 pb-3">Recently Documented</h3>
            {stats.recent.length === 0 ? (
              <p className="text-xs font-mono text-military-500 uppercase">No wars added yet.</p>
            ) : (
              <ul className="space-y-3">
                {stats.recent.map((war) => (
                  <li key={war.id}>
                    <Link href={`/library/${war.id}`} className="block p-3 rounded-sm bg-military-900 border border-military-700 hover:border-military-500 hover:bg-military-800 transition-colors group">
                      <div className="text-sm font-bold text-slate-200 uppercase tracking-wider group-hover:text-intel-400 transition-colors">{war.title}</div>
                      <div className="text-[10px] font-mono tracking-widest text-military-500 mt-1.5 uppercase">Added {war.createdAt ? new Date(war.createdAt).toLocaleDateString() : 'Unknown'}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-alert-900/10 p-6 rounded-sm border border-alert-900/40 shadow-sm border-l-4 border-l-alert-600 relative overflow-hidden backdrop-blur-sm">
            <h3 className="text-sm font-black tracking-widest text-alert-500 uppercase mb-1">Incomplete Entries</h3>
            <p className="text-[10px] font-mono tracking-widest text-military-400 mb-5 uppercase">Wars missing core data keys.</p>
            {stats.incomplete.length === 0 ? (
              <div className="flex items-center space-x-3 text-emerald-500 border border-emerald-900/50 bg-emerald-900/20 p-3 rounded-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-widest">All current entries verify complete!</span>
              </div>
            ) : (
              <ul className="space-y-3">
                {stats.incomplete.map((war) => (
                  <li key={war.id}>
                    <Link href={`/library/${war.id}`} className="text-xs font-bold font-mono tracking-wider text-alert-600 hover:text-alert-400 flex items-center bg-military-950 p-2 rounded-sm border border-alert-900 border-dashed">
                      <span className="mr-2 text-alert-700 animate-pulse">■</span> {war.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}