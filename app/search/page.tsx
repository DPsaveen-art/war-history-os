"use client";

import { useEffect, useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import WarCard from "@/components/library/WarCard";
import { getWars, getNotes } from "@/lib/storage";
import { War } from "@/types/war";
import { Note } from "@/types/note";

type SearchResult = 
  | { type: "war", data: War }
  | { type: "note", data: Note };

export default function SearchPage() {
  const [wars, setWars] = useState<War[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setWars(getWars());
    setNotes(getNotes());
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    const found: SearchResult[] = [];
    
    wars.forEach((war) => {
      const matchTitle = war.title.toLowerCase().includes(q);
      const matchSummary = war.summary.toLowerCase().includes(q);
      const matchRegion = war.region.toLowerCase().includes(q);
      const matchTags = war.tags?.some((t) => t.toLowerCase().includes(q));
      const matchAltNames = war.alternateNames?.some((n) => n.toLowerCase().includes(q));
      const matchLeaders = war.leaders?.some((l) => l.toLowerCase().includes(q));
      const matchBattles = war.majorBattles?.some((b) => b.toLowerCase().includes(q));
      const matchBackground = war.background?.toLowerCase().includes(q);
      const matchCauses = war.deepCauses?.some(c => c.toLowerCase().includes(q)) || war.immediateCauses?.some(c => c.toLowerCase().includes(q));
      const matchOutcome = war.outcome?.toLowerCase().includes(q) || war.consequences?.some(c => c.toLowerCase().includes(q));

      if (matchTitle || matchSummary || matchRegion || matchTags || matchAltNames || matchLeaders || matchBattles || matchBackground || matchCauses || matchOutcome) {
        found.push({ type: "war", data: war });
      }
    });

    notes.forEach((note) => {
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTags = note.tags?.some(t => t.toLowerCase().includes(q));

      if (matchTitle || matchContent || matchTags) {
        found.push({ type: "note", data: note });
      }
    });

    return found;
  }, [wars, notes, query]);

  return (
    <AppShell>
      <PageHeader
        title="Global Search"
        description="Search across all historical events, leaders, battles, notes, and tags."
      />

      <div className="mb-10 mt-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-military-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full p-5 pl-14 text-sm font-mono tracking-widest uppercase text-slate-100 border border-military-600 rounded-sm bg-military-900/80 focus:ring-1 focus:ring-military-400 focus:border-military-400 outline-none shadow-inner transition-all placeholder:text-military-600"
            placeholder="[ QUERY ARCHIVES: WARS, LEADERS, TREATIES, FIELD NOTES... ]"
            required
          />
        </div>
      </div>

      <div>
        {query.trim() === "" ? (
          <div className="bg-military-900/40 border border-military-800 border-dashed rounded-sm p-12 text-center shadow-sm">
            <svg className="w-10 h-10 text-military-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-military-500 text-sm font-mono tracking-widest uppercase">Awaiting query parameters.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-red-900/10 border border-red-900/40 rounded-sm p-10 text-center shadow-sm">
            <p className="text-red-500 text-sm font-bold tracking-widest uppercase font-mono">No records found for &quot;{query}&quot;.</p>
            <p className="text-red-700 text-xs mt-2 uppercase font-mono tracking-widest">Adjust criteria and retry.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-[10px] font-black text-intel-500 uppercase tracking-widest mb-6 border-b border-military-700 pb-2 flex items-center gap-3">
              <span className="bg-intel-900/40 px-3 py-1 border border-intel-800 rounded-sm">RECORDS MATCHED: {results.length}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-military-700 to-transparent"></div>
            </h3>
            <div className="space-y-6">
              {results.map((res, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <span className={`px-3 py-1 text-[10px] font-mono font-black uppercase tracking-widest rounded-sm shadow-inner ${res.type === 'war' ? 'bg-intel-900/80 text-intel-400 border border-intel-700' : 'bg-alert-900/80 text-alert-500 border border-alert-700'}`}>
                      {res.type === 'war' ? 'CLASSIFIED RECORD' : 'FIELD NOTE'}
                    </span>
                  </div>
                  
                  {res.type === 'war' ? (
                    <div className="rounded-sm">
                      <WarCard war={res.data as War} />
                    </div>
                  ) : (
                    <div className="bg-alert-900/10 p-6 rounded-sm border border-alert-600/30 shadow-sm transition-all hover:bg-alert-900/20 hover:border-alert-500 backdrop-blur-sm cursor-crosshair">
                      <h4 className="text-xl font-black uppercase tracking-wider text-alert-500 mb-2 pr-40">{res.data.title}</h4>
                      <div className="text-[10px] font-mono tracking-widest text-alert-700 mb-4 uppercase">LOGGED: {new Date(res.data.createdAt).toLocaleDateString()}</div>
                      <p className="text-sm font-mono text-slate-300 leading-relaxed max-w-4xl whitespace-pre-wrap mb-6 border-l-2 border-alert-800 pl-3">{res.data.content}</p>
                      {res.data.tags && res.data.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-alert-900">
                          {res.data.tags.map(t => (
                            <span key={t} className="text-[10px] font-mono font-black uppercase tracking-wider text-alert-600 bg-military-900 px-2.5 py-1 rounded-sm border border-alert-800 opacity-80 hover:opacity-100">[{t}]</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}