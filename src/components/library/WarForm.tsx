"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { War, Faction, CountryIntel } from "@/types/war";

type WarFormProps = {
  onAdd?: (war: War) => void;
  onUpdate?: (war: War) => void;
  initialData?: War | null;
};

const inputClass = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm";
const textareaClass = `${inputClass} min-h-[100px] resize-y`;

const InputGroup = ({ label, required, children, helperText }: { label: string, required?: boolean, children: React.ReactNode, helperText?: string }) => (
  <div className="flex flex-col mb-4">
    <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center">
      {label} 
      {required && <span className="text-red-500 ml-1" title="Required">*</span>}
    </label>
    {helperText && <span className="text-xs text-slate-500 mb-2">{helperText}</span>}
    {children}
  </div>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <fieldset className="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <legend className="text-lg font-bold text-slate-800 px-3 bg-slate-100 rounded-full py-1 ring-1 ring-slate-200 ml-2 shadow-sm">{title}</legend>
    <div className="mt-4">{children}</div>
  </fieldset>
);
import { useHistory } from "@/context/HistoryContext";
import UndoRedoControls from "../shared/UndoRedoControls";

export default function WarForm({ onAdd, onUpdate, initialData }: WarFormProps) {
  const { state, commit, isUndoingRedoing } = useHistory();
  
  const [title, setTitle] = useState("");
  const [alternateNames, setAlternateNames] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [era, setEra] = useState("");
  const [region, setRegion] = useState("");
  
  const [summary, setSummary] = useState("");
  const [background, setBackground] = useState("");
  const [deepCauses, setDeepCauses] = useState("");
  const [immediateCauses, setImmediateCauses] = useState("");
  const [triggerEvent, setTriggerEvent] = useState("");
  
  const [belligerents, setBelligerents] = useState("");
  const [factions, setFactions] = useState<Faction[]>([]);
  
  const [leaders, setLeaders] = useState("");
  const [majorBattles, setMajorBattles] = useState("");
  const [turningPoints, setTurningPoints] = useState("");
  
  const [outcome, setOutcome] = useState("");
  const [consequences, setConsequences] = useState("");
  const [lessons, setLessons] = useState("");
  
  const [tags, setTags] = useState("");
  const [sources, setSources] = useState("");

  const [heroImage, setHeroImage] = useState("");
  const [visualGallery, setVisualGallery] = useState("");
  
  const [involvedCountries, setInvolvedCountries] = useState("");
  const [invadedCountries, setInvadedCountries] = useState("");
  const [geographicalData, setGeographicalData] = useState<CountryIntel[]>([]);

  const [error, setError] = useState("");

  // Debounced History Commit
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isInternalChange = useRef(false);

  const getFormStateAsWar = useCallback((): Partial<War> => {
    return {
      title, alternateNames: splitLines(alternateNames), startYear: Number(startYear), endYear: endYear ? Number(endYear) : null,
      era, region, summary, background, deepCauses: splitLines(deepCauses), immediateCauses: splitLines(immediateCauses),
      triggerEvent, belligerents: splitLines(belligerents), factions, leaders: splitLines(leaders),
      majorBattles: splitLines(majorBattles), turningPoints: splitLines(turningPoints), outcome,
      consequences: splitLines(consequences), lessons: splitLines(lessons), tags: splitLines(tags),
      sources: splitLines(sources), heroImage, visualGallery: splitLines(visualGallery),
      involvedCountries: splitLines(involvedCountries), invadedCountries: splitLines(invadedCountries),
      geographicalData
    };
  }, [title, alternateNames, startYear, endYear, era, region, summary, background, deepCauses, immediateCauses, triggerEvent, belligerents, factions, leaders, majorBattles, turningPoints, outcome, consequences, lessons, tags, sources, heroImage, visualGallery, involvedCountries, invadedCountries, geographicalData]);

  useEffect(() => {
    if (isUndoingRedoing) return; // Don't commit while undoing/redoing
    
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const currentDraft = getFormStateAsWar();
      // Only commit if significantly different from last present or if it's a first change
      commit({ draftWar: currentDraft }, "Form Change");
    }, 1200);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [title, alternateNames, startYear, endYear, era, region, summary, background, deepCauses, immediateCauses, triggerEvent, belligerents, factions, leaders, majorBattles, turningPoints, outcome, consequences, lessons, tags, sources, heroImage, visualGallery, involvedCountries, invadedCountries, geographicalData, commit, getFormStateAsWar, isUndoingRedoing]);

  // Handle Undo/Redo from History
  useEffect(() => {
    if (isUndoingRedoing && state.draftWar) {
      const d = state.draftWar;
      if (d.title !== undefined) setTitle(d.title);
      if (d.alternateNames !== undefined) setAlternateNames(d.alternateNames.join("\n"));
      if (d.startYear !== undefined && d.startYear !== null) setStartYear(d.startYear.toString());
      if (d.endYear !== undefined) setEndYear(d.endYear?.toString() || "");
      if (d.era !== undefined) setEra(d.era);
      if (d.region !== undefined) setRegion(d.region);
      if (d.summary !== undefined) setSummary(d.summary);
      if (d.background !== undefined) setBackground(d.background);
      if (d.deepCauses !== undefined) setDeepCauses(d.deepCauses.join("\n"));
      if (d.immediateCauses !== undefined) setImmediateCauses(d.immediateCauses.join("\n"));
      if (d.triggerEvent !== undefined) setTriggerEvent(d.triggerEvent);
      if (d.belligerents !== undefined) setBelligerents(d.belligerents.join("\n"));
      if (d.factions !== undefined) setFactions(d.factions);
      if (d.leaders !== undefined) setLeaders(d.leaders.join("\n"));
      if (d.majorBattles !== undefined) setMajorBattles(d.majorBattles.join("\n"));
      if (d.turningPoints !== undefined) setTurningPoints(d.turningPoints.join("\n"));
      if (d.outcome !== undefined) setOutcome(d.outcome);
      if (d.consequences !== undefined) setConsequences(d.consequences.join("\n"));
      if (d.lessons !== undefined) setLessons(d.lessons.join("\n"));
      if (d.tags !== undefined) setTags(d.tags.join("\n"));
      if (d.sources !== undefined) setSources(d.sources.join("\n"));
      if (d.heroImage !== undefined) setHeroImage(d.heroImage);
      if (d.visualGallery !== undefined) setVisualGallery(d.visualGallery.join("\n"));
      if (d.involvedCountries !== undefined) setInvolvedCountries(d.involvedCountries.join("\n"));
      if (d.invadedCountries !== undefined) setInvadedCountries(d.invadedCountries.join("\n"));
      if (d.geographicalData !== undefined) setGeographicalData(d.geographicalData);
    }
  }, [state.draftWar, isUndoingRedoing]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setAlternateNames(initialData.alternateNames?.join("\n") || "");
      setStartYear(initialData.startYear?.toString() || "");
      setEndYear(initialData.endYear?.toString() || "");
      setEra(initialData.era || "");
      setRegion(initialData.region || "");
      
      setSummary(initialData.summary || "");
      setBackground(initialData.background || "");
      setDeepCauses(initialData.deepCauses?.join("\n") || "");
      setImmediateCauses(initialData.immediateCauses?.join("\n") || "");
      setTriggerEvent(initialData.triggerEvent || "");
      
      setBelligerents(initialData.belligerents?.join("\n") || "");
      setFactions(initialData.factions || []);
      
      setLeaders(initialData.leaders?.join("\n") || "");
      setMajorBattles(initialData.majorBattles?.join("\n") || "");
      setTurningPoints(initialData.turningPoints?.join("\n") || "");
      
      setOutcome(initialData.outcome || "");
      setConsequences(initialData.consequences?.join("\n") || "");
      setLessons(initialData.lessons?.join("\n") || "");
      
      setTags(initialData.tags?.join("\n") || "");
      setSources(initialData.sources?.join("\n") || "");
      
      setHeroImage(initialData.heroImage || "");
      setVisualGallery(initialData.visualGallery?.join("\n") || "");
      
      setInvolvedCountries(initialData.involvedCountries?.join("\n") || "");
      setInvadedCountries(initialData.invadedCountries?.join("\n") || "");
      setGeographicalData(initialData.geographicalData || []);
    }
  }, [initialData]);

  // Use newline to split lists to preserve commas in complex names
  function splitLines(text: string): string[] {
    return text.split("\n").map((s) => s.trim()).filter(Boolean);
  }

  const handleAddFaction = () => setFactions([...factions, { name: "", combatants: [], leaders: [] }]);
  const handleRemoveFaction = (idx: number) => setFactions(factions.filter((_, i) => i !== idx));
  const handleUpdateFaction = (idx: number, field: keyof Faction, val: string) => {
    const updated = [...factions];
    if (field === "name") {
      updated[idx].name = val;
    } else {
      updated[idx][field] = splitLines(val);
    }
    setFactions(updated);
  };

  const handleAddGeo = () => setGeographicalData([...geographicalData, { name: "", side: "", leader: "", role: "neutral" }]);
  const handleRemoveGeo = (idx: number) => setGeographicalData(geographicalData.filter((_, i) => i !== idx));
  const handleUpdateGeo = (idx: number, field: keyof CountryIntel, val: string) => {
    const updated = [...geographicalData];
    updated[idx] = { ...updated[idx], [field]: val };
    setGeographicalData(updated);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !summary.trim() || !region.trim()) {
      setError("Title, Region, and Summary are required fields.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (startYear === "" || isNaN(Number(startYear))) {
      setError("Start Year must be a valid number.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (endYear !== "" && isNaN(Number(endYear))) {
      setError("End Year must be a valid number if provided.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const warData: War = {
      id: initialData ? initialData.id : Date.now().toString(),
      title: title.trim(),
      alternateNames: splitLines(alternateNames),
      startYear: Number(startYear),
      endYear: endYear ? Number(endYear) : null,
      era: era.trim(),
      region: region.trim(),
      summary: summary.trim(),
      background: background.trim(),
      deepCauses: splitLines(deepCauses),
      immediateCauses: splitLines(immediateCauses),
      triggerEvent: triggerEvent.trim(),
      belligerents: splitLines(belligerents),
      factions,
      leaders: splitLines(leaders),
      majorBattles: splitLines(majorBattles),
      turningPoints: splitLines(turningPoints),
      outcome: outcome.trim(),
      consequences: splitLines(consequences),
      lessons: splitLines(lessons),
      tags: splitLines(tags),
      sources: splitLines(sources),
      heroImage: heroImage.trim() || undefined,
      visualGallery: splitLines(visualGallery),
      involvedCountries: splitLines(involvedCountries),
      invadedCountries: splitLines(invadedCountries),
      geographicalData,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (initialData && onUpdate) {
      onUpdate(warData);
    } else if (onAdd) {
      onAdd(warData);
      // Reset only if adding new
      setTitle(""); setAlternateNames(""); setStartYear(""); setEndYear(""); setEra(""); setRegion("");
      setSummary(""); setBackground(""); setDeepCauses(""); setImmediateCauses(""); setTriggerEvent("");
      setBelligerents(""); setFactions([]); setLeaders(""); setMajorBattles(""); setTurningPoints("");
      setOutcome(""); setConsequences(""); setLessons("");
      setTags(""); setSources("");
      setHeroImage(""); setVisualGallery(""); setInvolvedCountries(""); setInvadedCountries(""); setGeographicalData([]);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 relative max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 px-2">
        <h3 className="text-2xl font-black text-slate-900">
          {initialData ? "Edit War Entry" : "Document New War"}
        </h3>
        <UndoRedoControls showLabels />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6 flex items-center shadow-sm">
          <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      {/* 1. Basic Information */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <InputGroup label="Title" required>
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. World War II" />
          </InputGroup>
          <InputGroup label="Alternate Names" helperText="(One per line)">
            <textarea className={textareaClass} value={alternateNames} onChange={(e) => setAlternateNames(e.target.value)} placeholder="Second World War" />
          </InputGroup>
          <InputGroup label="Start Year" required>
            <input type="number" className={inputClass} value={startYear} onChange={(e) => setStartYear(e.target.value)} placeholder="e.g. 1939" />
          </InputGroup>
          <InputGroup label="End Year">
            <input type="number" className={inputClass} value={endYear} onChange={(e) => setEndYear(e.target.value)} placeholder="e.g. 1945" />
          </InputGroup>
          <InputGroup label="Region" required>
            <input className={inputClass} value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Europe, Global" />
          </InputGroup>
          <InputGroup label="Era">
            <input className={inputClass} value={era} onChange={(e) => setEra(e.target.value)} placeholder="e.g. Modern, Antiquity" />
          </InputGroup>
        </div>
      </Section>

      {/* 2. Background and Causes */}
      <Section title="Background and Causes">
        <InputGroup label="Summary" required>
          <textarea className={textareaClass} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="A concise overview of the event..." />
        </InputGroup>
        <InputGroup label="Background Context" helperText="Will preserve paragraph spacing.">
          <textarea className={textareaClass} value={background} onChange={(e) => setBackground(e.target.value)} placeholder="The political and social climate leading up to the war..." />
        </InputGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <InputGroup label="Deep Causes" helperText="(One per line)">
            <textarea className={textareaClass} value={deepCauses} onChange={(e) => setDeepCauses(e.target.value)} placeholder={"Nationalism\nImperial Expansion"} />
          </InputGroup>
          <InputGroup label="Immediate Causes" helperText="(One per line)">
            <textarea className={textareaClass} value={immediateCauses} onChange={(e) => setImmediateCauses(e.target.value)} placeholder={"Assassination of Archduke Franz Ferdinand"} />
          </InputGroup>
        </div>
        <InputGroup label="Trigger Event">
          <input className={inputClass} value={triggerEvent} onChange={(e) => setTriggerEvent(e.target.value)} placeholder="e.g. Invasion of Poland" />
        </InputGroup>
      </Section>

      {/* 3. Actors and Factions */}
      <Section title="Actors and Factions">
        <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800">Structured Factions (Recommended)</h4>
            <button type="button" onClick={handleAddFaction} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-bold">+ Add Faction</button>
          </div>
          {factions.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No factions added. Using unstructured belligerents fallback.</p>
          ) : (
            <div className="space-y-4">
              {factions.map((f, idx) => (
                <div key={idx} className="bg-white p-4 border border-slate-200 rounded-lg relative shadow-sm">
                  <button type="button" onClick={() => handleRemoveFaction(idx)} className="absolute top-3 right-3 text-red-500 hover:bg-red-50 rounded-full p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  <div className="grid grid-cols-1 gap-4 pr-8">
                    <InputGroup label={`Faction ${idx + 1} Name`}>
                      <input className={inputClass} value={f.name} onChange={(e) => handleUpdateFaction(idx, "name", e.target.value)} placeholder="e.g. Allies" />
                    </InputGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputGroup label="Combatants" helperText="(One per line)">
                        <textarea className={`${inputClass} min-h-[80px]`} value={f.combatants.join("\n")} onChange={(e) => handleUpdateFaction(idx, "combatants", e.target.value)} placeholder={"United Kingdom\nFrance\nRussia"} />
                      </InputGroup>
                      <InputGroup label="Key Leaders" helperText="(One per line)">
                        <textarea className={`${inputClass} min-h-[80px]`} value={f.leaders.join("\n")} onChange={(e) => handleUpdateFaction(idx, "leaders", e.target.value)} placeholder={"Winston Churchill\nCharles de Gaulle"} />
                      </InputGroup>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <InputGroup label="Unstructured Belligerents Legacy Fallback" helperText="(One per line. Used if Factions above are empty)">
          <textarea className={textareaClass} value={belligerents} onChange={(e) => setBelligerents(e.target.value)} placeholder="Allied Powers, Axis Powers" />
        </InputGroup>

        <InputGroup label="Unaffiliated / Global Leaders" helperText="(One per line)">
          <textarea className={textareaClass} value={leaders} onChange={(e) => setLeaders(e.target.value)} placeholder="Winston Churchill" />
        </InputGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <InputGroup label="Major Battles" helperText="(One per line)">
            <textarea className={textareaClass} value={majorBattles} onChange={(e) => setMajorBattles(e.target.value)} placeholder="Battle of Stalingrad" />
          </InputGroup>
          <InputGroup label="Turning Points" helperText="(One per line)">
            <textarea className={textareaClass} value={turningPoints} onChange={(e) => setTurningPoints(e.target.value)} placeholder="Battle of Midway" />
          </InputGroup>
        </div>
      </Section>

      {/* 4. Outcome and Consequences */}
      <Section title="Outcome and Consequences">
        <InputGroup label="Outcome">
          <input className={inputClass} value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="e.g. Decisive Allied Victory" />
        </InputGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <InputGroup label="Consequences" helperText="(One per line. Preserves commas within lines.)">
            <textarea className={textareaClass} value={consequences} onChange={(e) => setConsequences(e.target.value)} placeholder={"Fall of empires (Ottoman, German, Russian)\nCreation of UN"} />
          </InputGroup>
          <InputGroup label="Lessons Learned" helperText="(One per line)">
            <textarea className={textareaClass} value={lessons} onChange={(e) => setLessons(e.target.value)} placeholder="Dangers of Appeasement" />
          </InputGroup>
        </div>
      </Section>

      {/* 5. Map & Geography */}
      <Section title="Map & Geographical Intelligence">
        <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-800">Map Tooltip Metadata (Interactive Vectors)</h4>
            <button type="button" onClick={handleAddGeo} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 font-bold">+ Add Country Intel</button>
          </div>
          {geographicalData.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No structured map data added.</p>
          ) : (
            <div className="space-y-4">
              {geographicalData.map((g, idx) => (
                <div key={idx} className="bg-white p-4 border border-slate-200 rounded-lg relative shadow-sm">
                  <button type="button" onClick={() => handleRemoveGeo(idx)} className="absolute top-3 right-3 text-red-500 hover:bg-red-50 rounded-full p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                    <InputGroup label="Country Name (Exact SVG match)">
                      <input className={inputClass} value={g.name} onChange={(e) => handleUpdateGeo(idx, "name", e.target.value)} placeholder="e.g. Germany" />
                    </InputGroup>
                    <InputGroup label="Role">
                      <select className={inputClass} value={g.role} onChange={(e) => handleUpdateGeo(idx, "role", e.target.value)}>
                        <option value="neutral">Neutral</option>
                        <option value="aggressor">Aggressor / Instigator</option>
                        <option value="invader">Invading Force</option>
                        <option value="occupied">Invaded / Occupied</option>
                        <option value="ally">Ally / Defender</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="Faction / Side">
                      <input className={inputClass} value={g.side} onChange={(e) => handleUpdateGeo(idx, "side", e.target.value)} placeholder="e.g. Central Powers" />
                    </InputGroup>
                    <InputGroup label="Leader(s)">
                      <input className={inputClass} value={g.leader} onChange={(e) => handleUpdateGeo(idx, "leader", e.target.value)} placeholder="e.g. Kaiser Wilhelm II" />
                    </InputGroup>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 opacity-60">
          <InputGroup label="Legacy Involved Countries" helperText="(Fallback)">
            <textarea className={textareaClass} value={involvedCountries} onChange={(e) => setInvolvedCountries(e.target.value)} placeholder="Germany\nFrance\nUnited Kingdom" />
          </InputGroup>
          <InputGroup label="Legacy Invaded Countries" helperText="(Fallback)">
            <textarea className={textareaClass} value={invadedCountries} onChange={(e) => setInvadedCountries(e.target.value)} placeholder="Poland\nBelgium\nNetherlands" />
          </InputGroup>
        </div>
      </Section>

      {/* 6. Visual Media */}
      <Section title="Visual Media (URLs only)">
        <InputGroup label="Hero Background Image URL (Direct link to jpg/png)">
          <input className={inputClass} value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="https://example.com/ww2-background.jpg" />
        </InputGroup>
        <InputGroup label="Gallery Image URLs" helperText="(One per line)">
          <textarea className={textareaClass} value={visualGallery} onChange={(e) => setVisualGallery(e.target.value)} placeholder="https://example.com/img1.jpg\nhttps://example.com/img2.jpg" />
        </InputGroup>
      </Section>

      {/* 7. Metadata */}
      <Section title="Metadata">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <InputGroup label="Tags" helperText="(One per line)">
            <textarea className={textareaClass} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="20th Century\nIdeological" />
          </InputGroup>
          <InputGroup label="Sources" helperText="(One per line)">
            <textarea className={textareaClass} value={sources} onChange={(e) => setSources(e.target.value)} placeholder="The Second World War by Antony Beevor" />
          </InputGroup>
        </div>
      </Section>

      <button
        type="submit"
        className="w-full mt-4 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-slate-300"
      >
        {initialData ? "Save Changes" : "Save New Entry to Library"}
      </button>
    </form>
  );
}