"use client";

import { useEffect, useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import WarCard from "@/components/library/WarCard";
import PageHeader from "@/components/shared/PageHeader";
import WarForm from "@/components/library/WarForm";
import SearchFilter from "@/components/library/SearchFilter";
import { getWars, resetWars } from "@/lib/storage";
import { War } from "@/types/war";
import { useHistory } from "@/context/HistoryContext";
import UndoRedoControls from "@/components/shared/UndoRedoControls";

export default function LibraryPage() {
  const { state, commit } = useHistory();
  const wars = state.wars;
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedEra, setSelectedEra] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest" | "az">("recent");

  // Show/Hide Form
  const [isFormOpen, setIsFormOpen] = useState(false);

  function handleAdd(war: War) {
    const updated = [war, ...wars];
    commit({ wars: updated }, "Documented New War");
    setIsFormOpen(false);
  }

  function handleReset() {
    if(confirm("Are you sure you want to reset to sample data? Custom entries will be lost.")) {
      resetWars();
      commit({ wars: getWars() }, "Reset to Sample Data");
    }
  }

  // Derive dynamic filter lists
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    wars.forEach((war) => war.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [wars]);

  const availableRegions = useMemo(() => {
    const regions = new Set<string>();
    wars.forEach((war) => { if (war.region) regions.add(war.region); });
    return Array.from(regions).sort();
  }, [wars]);

  const availableEras = useMemo(() => {
    const eras = new Set<string>();
    wars.forEach((war) => { if (war.era) eras.add(war.era); });
    return Array.from(eras).sort();
  }, [wars]);

  const filteredWars = useMemo(() => {
    let result = wars.filter((war) => {
      // 1. Search Query
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === "" ||
        war.title.toLowerCase().includes(q) ||
        war.summary.toLowerCase().includes(q) ||
        war.leaders?.some(l => l.toLowerCase().includes(q)) ||
        war.majorBattles?.some(b => b.toLowerCase().includes(q));

      // 2. Exact Filters
      const matchesTag = selectedTag === "" || (war.tags && war.tags.includes(selectedTag));
      const matchesRegion = selectedRegion === "" || war.region === selectedRegion;
      const matchesEra = selectedEra === "" || war.era === selectedEra;
      
      // 3. Status
      let matchesStatus = true;
      if (statusFilter === "ongoing") matchesStatus = war.endYear === null;
      if (statusFilter === "ended") matchesStatus = war.endYear !== null;

      return matchesSearch && matchesTag && matchesRegion && matchesEra && matchesStatus;
    });

    // 4. Sort
    result.sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortOrder === "oldest") {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      if (sortOrder === "az") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [wars, searchQuery, selectedTag, selectedRegion, selectedEra, statusFilter, sortOrder]);

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <PageHeader
          title="Wars Library"
          description="Browse and manage the full historical archive."
        />
        <div className="flex gap-3">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-6 py-2 bg-intel-500/20 text-intel-500 hover:bg-intel-500 hover:text-military-950 font-black uppercase tracking-widest text-xs rounded-sm border border-intel-500 transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)] shadow-intel-500/20"
          >
            {isFormOpen ? "[ CANCEL INPUT ]" : "[ DOCUMENT NEW ]"}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-military-800 text-military-400 font-black uppercase tracking-widest text-xs rounded-sm hover:bg-military-700 hover:text-white border border-military-600 transition-all"
          >
            [ RESET ]
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="mb-10 bg-military-900/60 p-6 rounded-sm border-t-4 border-intel-500 shadow-xl backdrop-blur-md">
          <WarForm onAdd={handleAdd} />
        </div>
      )}

      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedEra={selectedEra}
        setSelectedEra={setSelectedEra}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        availableTags={availableTags}
        availableRegions={availableRegions}
        availableEras={availableEras}
      />

      <div className="mb-6 flex items-center gap-4 border-b border-military-700 pb-2">
        <h3 className="text-[10px] font-black text-intel-500 uppercase tracking-widest bg-intel-900/40 px-3 py-1 border border-intel-800 rounded-sm">
          RECORDS MATCHED: {filteredWars.length}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-r from-military-700 to-transparent"></div>
      </div>

      <div className="space-y-4">
        {filteredWars.length === 0 ? (
          <div className="bg-military-900/40 p-12 rounded-sm border border-military-800 border-dashed text-center">
            <p className="text-military-500 font-mono tracking-widest uppercase mb-4">No records match criteria.</p>
            <button onClick={() => { setSearchQuery(""); setSelectedTag(""); setSelectedRegion(""); setSelectedEra(""); setStatusFilter("all"); }} className="text-intel-500 text-sm font-bold uppercase tracking-widest hover:text-white transition-colors border-b border-intel-500 hover:border-white">
              [ Clear Filters ]
            </button>
          </div>
        ) : (
          filteredWars.map((war) => (
            <WarCard key={war.id} war={war} />
          ))
        )}
      </div>
    </AppShell>
  );
}