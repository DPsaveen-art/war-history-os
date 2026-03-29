import React from "react";

type SearchFilterProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedEra: string;
  setSelectedEra: (era: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortOrder: "recent" | "oldest" | "az";
  setSortOrder: (sort: "recent" | "oldest" | "az") => void;
  availableTags: string[];
  availableRegions: string[];
  availableEras: string[];
};

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  selectedRegion,
  setSelectedRegion,
  selectedEra,
  setSelectedEra,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
  availableTags,
  availableRegions,
  availableEras,
}: SearchFilterProps) {
  const inputClass = "w-full p-2.5 bg-military-900/80 border border-military-700 rounded-sm text-slate-200 placeholder:text-military-600 focus:outline-none focus:ring-1 focus:ring-military-500 focus:border-military-500 transition-all font-mono text-[10px] uppercase tracking-widest shadow-inner appearance-none";

  return (
    <div className="bg-military-950/80 p-5 rounded-sm border border-military-800 shadow-md mb-8 space-y-4 backdrop-blur-sm relative">
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-military-600 opacity-50 m-[-1px]"></div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <svg className="w-4 h-4 absolute left-3 top-3 text-military-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            className={`${inputClass} pl-10 h-full`}
            placeholder="[ QUERY TITLE, SUMMARY, BATTLES... ]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <select className={`${inputClass} h-full custom-select`} value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)}>
            <option value="recent">SORT: RECENTLY UPDATED</option>
            <option value="oldest">SORT: OLDEST UPDATED</option>
            <option value="az">SORT: ALPHABETICAL (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <select className={`${inputClass} py-3`} value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
          <option value="">REGION: ALL</option>
          {availableRegions.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
        
        <select className={`${inputClass} py-3`} value={selectedEra} onChange={(e) => setSelectedEra(e.target.value)}>
          <option value="">ERA: ALL</option>
          {availableEras.map((era) => (
            <option key={era} value={era}>{era}</option>
          ))}
        </select>

        <select className={`${inputClass} py-3`} value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">TAG: ALL</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>#{tag}</option>
          ))}
        </select>

        <select className={`${inputClass} py-3`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">STATUS: ALL</option>
          <option value="ongoing">STATUS: ACTIVE CONFLICT</option>
          <option value="ended">STATUS: CONCLUDED</option>
        </select>
      </div>
    </div>
  );
}
