"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { getWarById, deleteWar, getNotes } from "@/lib/storage";
import { War } from "@/types/war";
import { Note } from "@/types/note";
import { formatYears } from "@/lib/utils";
import WarForm from "@/components/library/WarForm";
import TacticalMap from "@/components/library/TacticalMap";
import { Faction } from "@/types/war";

export default function WarDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [war, setWar] = useState<War | null>(null);
  const [linkedNotes, setLinkedNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundWar = getWarById(id);
      setWar(foundWar || null);

      if (foundWar) {
        const allNotes = getNotes();
        const related = allNotes.filter(n => n.linkedWarId === foundWar.id);
        setLinkedNotes(related);
      }
    }
  }, [id]);

  if (!war) {
    return (
      <AppShell>
        <div className="text-center py-20 mt-10">
          <h1 className="text-3xl font-black text-slate-100 uppercase tracking-widest mb-4">Record Not Found</h1>
          <p className="text-slate-500 mb-8 font-mono">The requested operational file could not be located in the archives.</p>
          <button onClick={() => router.push("/library")} className="px-5 py-2.5 bg-military-800 border border-military-600 text-slate-300 rounded-sm font-bold uppercase tracking-widest hover:bg-military-700 transition">
            [ Return to Library ]
          </button>
        </div>
      </AppShell>
    );
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to permanently delete this classified record?")) {
      deleteWar(war.id);
      router.push("/library");
    }
  };

  const Section = ({ title, content }: { title: string; content?: string | string[] }) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;

    return (
      <div className="mb-12">
        <h4 className="text-sm font-bold text-military-400 uppercase tracking-widest mb-4 border-b border-military-800 pb-2">
          {title}
        </h4>
        {Array.isArray(content) ? (
          <ul className="list-disc pl-5 space-y-2 text-slate-300 leading-relaxed font-mono text-sm max-w-none">
            {content.map((item, idx) => (
              <li key={idx} className="marker:text-military-600">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap max-w-none text-base border-l-2 border-military-700 pl-4 bg-military-900/40 p-4 rounded-r-lg">
            {content}
          </p>
        )}
      </div>
    );
  };

  const FactionsDisplay = ({ factions, fallback }: { factions?: Faction[]; fallback?: string[] }) => {
    if (factions && factions.length > 0) {
      return (
        <div className="mb-12 mt-4 pt-10 border-t border-military-800">
          <h4 className="text-sm font-bold text-military-400 uppercase tracking-widest mb-6 border-b border-military-800 pb-2">
            Structured Factions & Combatants
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factions.map((f, i) => (
              <div key={i} className="bg-military-900/40 p-6 border border-military-700/50 rounded-sm shadow-sm backdrop-blur-sm">
                <h5 className="text-lg font-black text-slate-100 uppercase tracking-widest mb-5 border-b border-military-700 pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-alert-500"></span> {f.name}
                </h5>
                {f.combatants && f.combatants.length > 0 && (
                  <div className="mb-6">
                    <h6 className="text-[10px] font-bold text-military-500 uppercase tracking-widest mb-2">Combatants</h6>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-300 font-mono text-sm leading-relaxed max-w-none">
                      {f.combatants.map((c, j) => <li key={j} className="marker:text-military-600">{c}</li>)}
                    </ul>
                  </div>
                )}
                {f.leaders && f.leaders.length > 0 && (
                  <div>
                    <h6 className="text-[10px] font-bold text-military-500 uppercase tracking-widest mb-2">Key Leaders</h6>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-300 font-mono text-sm leading-relaxed max-w-none">
                      {f.leaders.map((L, j) => <li key={j} className="marker:text-alert-600">{L}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Fallback if no factions exist
    if (!fallback || fallback.length === 0) return null;
    return (
      <div className="mt-4 pt-10 border-t border-military-800">
        <Section title="Belligerents (Legacy)" content={fallback} />
      </div>
    );
  };

  const MetaItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="mb-6 last:mb-0">
      <h5 className="text-[10px] font-black uppercase tracking-widest text-military-500 mb-1.5">{label}</h5>
      <div className="text-sm font-bold font-mono text-slate-200">{value}</div>
    </div>
  );

  return (
    <AppShell>
      {/* Cinematic Hero Header */}
      <div className="relative -mx-4 md:-mx-8 -my-4 md:-my-8 mb-8 md:mb-12 h-64 md:h-96 bg-military-950 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          {war.heroImage ? (
            <img src={war.heroImage} alt={war.title} className="w-full h-full object-cover opacity-40 mix-blend-luminosity group-hover:opacity-70 group-hover:mix-blend-normal transition-all duration-700 ease-in-out" />
          ) : (
            <div className="w-full h-full bg-military-900" style={{ backgroundImage: 'radial-gradient(circle at center, #1c241d 0%, #0a0e0b 100%)' }}></div>
          )}
          {/* Grid Overlay */}
           <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4) 1px, transparent 1px)', backgroundSize: '100% 4px' }}></div>
           <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-screen-bg)] to-transparent"></div>
        </div>

        <div className="absolute top-4 right-4 z-20 flex shrink-0 gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-1.5 bg-military-800/80 backdrop-blur border border-military-600 rounded-sm text-slate-300 font-bold uppercase text-xs tracking-widest hover:bg-military-700 hover:text-white transition shadow-sm"
          >
            {isEditing ? "Cancel Edit" : "Edit File"}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-1.5 bg-red-900/60 backdrop-blur border border-red-700 text-red-200 rounded-sm font-bold uppercase text-xs tracking-widest hover:bg-red-800 transition shadow-sm"
          >
            Delete
          </button>
        </div>

        <div className="absolute bottom-0 left-0 p-8 z-10 w-full">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-block px-2 py-0.5 bg-military-600/50 backdrop-blur border border-military-500 text-slate-200 text-[10px] font-black uppercase tracking-widest mb-3 rounded-sm shadow-sm ring-1 ring-black/50">
                CLASS: {war.era || "UNCLASSIFIED"} // REGION: {war.region.toUpperCase()}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-lg mb-2">{war.title}</h1>
              <p className="text-xl font-bold font-mono text-alert-500 drop-shadow-md">
                {formatYears(war.startYear, war.endYear)}
              </p>
              {war.alternateNames && war.alternateNames.length > 0 && (
                <p className="mt-2 text-sm text-slate-400 font-mono italic">
                  AKA: {war.alternateNames.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="mb-10 p-6 bg-military-900/50 rounded-lg border border-military-700 shadow-inner">
          <WarForm 
            onUpdate={(updatedWar) => {
              import("@/lib/storage").then((mod) => {
                mod.updateWar(updatedWar);
                setWar(updatedWar);
                setIsEditing(false);
              });
            }} 
            initialData={war} 
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12 leading-relaxed">
            
            <div className="bg-military-900/30 border border-military-800 p-8 rounded-sm shadow-md backdrop-blur-sm">
              <Section title="Operational Summary" content={war.summary} />
            </div>

            {/* Tactical Map Display */}
            {((war.involvedCountries && war.involvedCountries.length > 0) || (war.invadedCountries && war.invadedCountries.length > 0) || (war.geographicalData && war.geographicalData.length > 0)) && (
              <div className="mb-12">
                 <h4 className="text-sm font-bold text-military-400 uppercase tracking-widest mb-4 border-b border-military-800 pb-2">
                    Global Theater Map
                 </h4>
                 <TacticalMap 
                    involvedCountries={war.involvedCountries || []} 
                    invadedCountries={war.invadedCountries || []} 
                    geographicalData={war.geographicalData || []}
                 />
              </div>
            )}

            <Section title="Context & Background" content={war.background} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              <Section title="Deep Causes" content={war.deepCauses} />
              <Section title="Immediate Causes" content={war.immediateCauses} />
            </div>
            
            <div className="bg-red-900/10 border-l-4 border-alert-600 pl-6 py-4 my-8 rounded-r-lg">
              <Section title="Trigger Event" content={war.triggerEvent} />
            </div>
            
            <FactionsDisplay factions={war.factions} fallback={war.belligerents} />
            
            {war.leaders && war.leaders.length > 0 && (
              <div className="mt-6">
                <Section title="Unaffiliated / Global Leaders" content={war.leaders} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-12 border-t border-military-800 pt-10">
              <Section title="Major Engagements" content={war.majorBattles} />
              <Section title="Strategic Turning Points" content={war.turningPoints} />
            </div>
            
            <div className="mt-8 pt-10 border-t-2 border-military-600">
              <div className="bg-emerald-900/10 border border-emerald-900/30 p-8 rounded-sm">
                <Section title="Final Outcome" content={war.outcome} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 mt-8">
                <Section title="Consequences" content={war.consequences} />
                <Section title="Historical Lessons" content={war.lessons} />
              </div>
            </div>

            {/* Visual Gallery */}
            {war.visualGallery && war.visualGallery.length > 0 && (
               <div className="pt-10 border-t border-military-800">
                 <h4 className="text-sm font-bold text-military-400 uppercase tracking-widest mb-6 border-b border-military-800 pb-2">
                    Visual Intelligence
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {war.visualGallery.map((img, idx) => (
                     <div key={idx} className="aspect-video relative rounded-sm overflow-hidden border border-military-700 bg-military-900 group">
                       <img src={img} alt={`Gallery image ${idx + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest border border-white/20 rounded-sm">FIG. {idx + 1}</div>
                     </div>
                   ))}
                 </div>
               </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <div className="bg-military-900/80 p-6 md:p-8 rounded-sm border border-military-700 shadow-xl backdrop-blur-sm sticky top-8">
              <div className="flex items-center gap-3 mb-8 border-b border-military-700 pb-4">
                 <div className="w-2 h-8 bg-alert-500 rounded-sm"></div>
                 <h3 className="text-lg font-black tracking-widest uppercase text-slate-100">Metadata Scan</h3>
              </div>
              
              <MetaItem label="Theater / Region" value={war.region} />
              {war.era && <MetaItem label="Temporal Era" value={war.era} />}
              <MetaItem label="Status" value={war.endYear ? "CONCLUDED" : "ACTIVE / UNKNOWN"} />
              
              {war.tags && war.tags.length > 0 && (
                <div className="mb-6 mt-8 border-t border-military-800 pt-6">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-military-500 mb-3">Classification Tags</h5>
                  <div className="flex flex-wrap gap-2">
                    {war.tags.map((tag) => (
                      <span key={tag} className="bg-military-800 border border-military-600 px-2 py-1 rounded-sm text-[10px] font-mono font-bold text-slate-300 shadow-inner tracking-wider">
                        [{tag}]
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {war.sources && war.sources.length > 0 && (
                <div className="mb-2 mt-8 border-t border-military-800 pt-6">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-military-500 mb-3">Verified Sources</h5>
                  <ul className="space-y-3">
                    {war.sources.map((s, idx) => (
                      <li key={idx} className="text-xs font-medium text-intel-500 hover:text-intel-400 transition cursor-pointer flex items-start border-l border-military-700 pl-3">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Linked Notes Widget */}
            {linkedNotes.length > 0 && (
              <div className="bg-alert-900/20 p-6 rounded-sm border border-alert-600/30 shadow-sm relative overflow-hidden backdrop-blur-sm mt-8">
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-alert-500/50 mt-2 mr-2 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-alert-500/50 mb-2 ml-2 opacity-50"></div>
                
                <h3 className="text-sm font-black text-alert-500 mb-5 relative z-10 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                  Field Notes
                </h3>
                <div className="space-y-4 relative z-10">
                  {linkedNotes.map(n => (
                    <div key={n.id} className="bg-military-900/80 p-4 rounded-sm border border-alert-600/40 shadow-sm hover:border-alert-500 transition cursor-crosshair">
                      <div className="font-bold text-xs text-slate-100 mb-2 font-mono uppercase tracking-wider">{n.title}</div>
                      <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed font-mono">{n.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
