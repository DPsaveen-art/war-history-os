"use client";

import { useEffect, useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import { getWars } from "@/lib/storage";
import { War } from "@/types/war";
import { formatYears } from "@/lib/utils";
import Link from "next/link";

export default function ConnectionsPage() {
  const [wars, setWars] = useState<War[]>([]);

  useEffect(() => {
    setWars(getWars());
  }, []);

  const connections = useMemo(() => {
    const byRegion: Record<string, War[]> = {};
    const byEra: Record<string, War[]> = {};
    const byTag: Record<string, War[]> = {};
    const byDeepCause: Record<string, War[]> = {};
    const byImmediateCause: Record<string, War[]> = {};
    const byOutcome: Record<string, War[]> = {};

    wars.forEach((war) => {
      // Region
      if (war.region) {
        if (!byRegion[war.region]) byRegion[war.region] = [];
        byRegion[war.region].push(war);
      }
      // Era
      if (war.era) {
        if (!byEra[war.era]) byEra[war.era] = [];
        byEra[war.era].push(war);
      }
      // Tags
      if (war.tags) {
        war.tags.forEach((tag) => {
          if (!byTag[tag]) byTag[tag] = [];
          byTag[tag].push(war);
        });
      }
      // Deep Causes
      if (war.deepCauses) {
        war.deepCauses.forEach((cause) => {
          const c = cause.trim();
          if (!byDeepCause[c]) byDeepCause[c] = [];
          byDeepCause[c].push(war);
        });
      }
      // Immediate Causes
      if (war.immediateCauses) {
        war.immediateCauses.forEach((cause) => {
          const c = cause.trim();
          if (!byImmediateCause[c]) byImmediateCause[c] = [];
          byImmediateCause[c].push(war);
        });
      }
      // Outcome
      if (war.outcome) {
        const o = war.outcome.trim();
        if (!byOutcome[o]) byOutcome[o] = [];
        byOutcome[o].push(war);
      }
    });

    // Filter to only include groups with at least 2 wars
    const filterMultiples = (obj: Record<string, War[]>) => {
      return Object.entries(obj).filter(([_, group]) => group.length > 1);
    };

    return {
      regions: filterMultiples(byRegion),
      eras: filterMultiples(byEra),
      tags: filterMultiples(byTag),
      deepCauses: filterMultiples(byDeepCause),
      immediateCauses: filterMultiples(byImmediateCause),
      outcomes: filterMultiples(byOutcome),
    };
  }, [wars]);

  const hasConnections =
    connections.regions.length > 0 ||
    connections.eras.length > 0 ||
    connections.tags.length > 0 ||
    connections.deepCauses.length > 0 ||
    connections.immediateCauses.length > 0 ||
    connections.outcomes.length > 0;

  const renderConnectionGroup = (title: string, groups: [string, War[]][], bgColor: string, accentColor: string) => {
    if (groups.length === 0) return null;

    return (
      <div className="mb-14">
        <h2 className="text-lg font-black tracking-widest uppercase text-slate-300 mb-6 flex items-center gap-3">
           <span className={`w-2 h-8 rounded-sm ${accentColor}`}></span>
           {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {groups.sort((a,b) => b[1].length - a[1].length).map(([key, groupWars]) => (
            <div
              key={key}
              className={`bg-military-900/60 p-5 rounded-sm border border-military-700 shadow-md flex flex-col backdrop-blur-sm group hover:border-${accentColor.split('-')[1]}-600 transition-all`}
            >
              <div className="flex items-start justify-between mb-5 gap-4 border-b border-military-800 pb-3">
                <h3 className={`text-sm font-black uppercase tracking-widest ${accentColor.replace('bg-', 'text-')}`}>{key}</h3>
                <span className={`${bgColor} ${accentColor.replace('bg-', 'text-')} text-[10px] font-mono font-bold px-2.5 py-1 rounded-sm shadow-inner border border-${accentColor.split('-')[1]}-900 whitespace-nowrap opacity-80 group-hover:opacity-100`}>
                  {groupWars.length} MATCHES
                </span>
              </div>
              <ul className="space-y-3 flex-grow">
                {groupWars.map((war) => (
                  <li key={war.id}>
                    <Link
                      href={`/library/${war.id}`}
                      className="block p-3 rounded-sm border border-military-800 bg-military-950/50 hover:border-military-500 hover:bg-military-800 transition-colors"
                    >
                      <div className="font-bold text-xs uppercase tracking-wider text-slate-300 group-hover:text-white line-clamp-1">{war.title}</div>
                      <div className="text-[10px] font-mono tracking-widest text-military-500 mt-1.5 uppercase">
                        {formatYears(war.startYear, war.endYear)}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AppShell>
      <PageHeader
        title="Connections Network"
        description="Discover historical patterns through linked conflicts, underlying causes, and similar outcomes."
      />

      {!hasConnections ? (
        <div className="text-center py-20 bg-military-900/40 border border-military-800 border-dashed rounded-sm mt-10">
          <p className="text-xs font-mono tracking-widest uppercase text-military-500 mb-2">Insufficient network data collected.</p>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">Cross-reference records via shared tags, origins, timelines, or regions to construct topological links.</p>
        </div>
      ) : (
        <div className="mt-10">
          {renderConnectionGroup("Shared Classifications (Tags)", connections.tags, "bg-intel-900/40", "bg-intel-500")}
          {renderConnectionGroup("Origin Causality (Deep Causes)", connections.deepCauses, "bg-red-900/40", "bg-red-500")}
          {renderConnectionGroup("Trigger Clusters (Immediate)", connections.immediateCauses, "bg-orange-900/40", "bg-orange-500")}
          {renderConnectionGroup("Parallel Outcomes", connections.outcomes, "bg-emerald-900/40", "bg-emerald-500")}
          {renderConnectionGroup("Geographical Concurrency", connections.regions, "bg-military-800/60", "bg-slate-300")}
          {renderConnectionGroup("Chronological Eras", connections.eras, "bg-slate-800/40", "bg-military-400")}
        </div>
      )}
    </AppShell>
  );
}