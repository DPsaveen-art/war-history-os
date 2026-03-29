"use client";

import { useEffect, useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import WarCard from "@/components/library/WarCard";
import { getWars } from "@/lib/storage";
import { War } from "@/types/war";

export default function TimelinePage() {
  const [wars, setWars] = useState<War[]>([]);

  useEffect(() => {
    setWars(getWars());
  }, []);

  const chronWars = useMemo(() => {
    return [...wars].sort((a, b) => {
      const yearA = a.startYear ?? Infinity;
      const yearB = b.startYear ?? Infinity;
      return yearA - yearB;
    });
  }, [wars]);

  return (
    <AppShell>
      <PageHeader
        title="Timeline"
        description="View wars chronologically ordered by start year."
      />

      {chronWars.length === 0 ? (
        <p className="text-slate-500 mt-5">No wars to display.</p>
      ) : (
        <div className="relative pl-6 mt-8 pb-4">
          {/* Timeline vertical line */}
          <div className="absolute top-0 bottom-0 left-[7px] w-[2px] bg-slate-200 z-0" />

          {chronWars.map((war) => (
            <div key={war.id} className="relative mb-6 pl-6">
              {/* Timeline dot */}
              <div
                className="absolute left-[-23px] top-[26px] w-3 h-3 rounded-full bg-white border-2 border-blue-500 z-10 ring-4 ring-slate-50"
              />
              
              <WarCard war={war} />
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}