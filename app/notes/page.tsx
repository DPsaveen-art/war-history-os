"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/shared/PageHeader";
import { useHistory } from "@/context/HistoryContext";
import { Note } from "@/types/note";
import UndoRedoControls from "@/components/shared/UndoRedoControls";

const inputClass = "w-full p-3 bg-military-900/80 border border-military-700 rounded-sm text-slate-100 placeholder:text-military-600 focus:outline-none focus:ring-1 focus:ring-alert-500 focus:border-alert-500 transition-all font-mono text-[10px] uppercase tracking-wider shadow-inner";

const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex flex-col mb-4">
    <label className="text-[10px] font-black text-alert-500 uppercase tracking-widest mb-2 flex items-center gap-2">
      <span className="w-1 h-1 bg-alert-500 rounded-full"></span> {label}
    </label>
    {children}
  </div>
);

export default function NotesPage() {
  const { state, commit, isUndoingRedoing } = useHistory();
  const notes = state.notes;
  const wars = state.wars;
  
  // Note Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkedWarId, setLinkedWarId] = useState("");
  const [region, setRegion] = useState("");
  const [era, setEra] = useState("");
  const [tags, setTags] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Debounced History Commit
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getFormStateAsNote = useCallback((): Partial<Note> => {
    return { title, content, linkedWarId: linkedWarId || undefined, region: region || undefined, era: era || undefined, tags: tags.split(",").map(s => s.trim()).filter(Boolean) };
  }, [title, content, linkedWarId, region, era, tags]);

  useEffect(() => {
    if (isUndoingRedoing) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      commit({ draftNote: getFormStateAsNote() }, "Field Note Draft Change");
    }, 1200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [title, content, linkedWarId, region, era, tags, commit, getFormStateAsNote, isUndoingRedoing]);

  // Handle Undo/Redo from History
  useEffect(() => {
    if (isUndoingRedoing && state.draftNote) {
      const d = state.draftNote;
      if (d.title !== undefined) setTitle(d.title);
      if (d.content !== undefined) setContent(d.content);
      if (d.linkedWarId !== undefined) setLinkedWarId(d.linkedWarId || "");
      if (d.region !== undefined) setRegion(d.region || "");
      if (d.era !== undefined) setEra(d.era || "");
      if (d.tags !== undefined) setTags(d.tags.join(", "));
    }
  }, [state.draftNote, isUndoingRedoing]);

  function splitLines(text: string): string[] {
    return text.split(",").map((s) => s.trim()).filter(Boolean);
  }

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      linkedWarId: linkedWarId || undefined,
      region: region.trim() || undefined,
      era: era.trim() || undefined,
      tags: splitLines(tags).length > 0 ? splitLines(tags) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newNote, ...notes];
    commit({ notes: updated }, "Logged New Field Intel");
    
    // Reset
    setTitle("");
    setContent("");
    setLinkedWarId("");
    setRegion("");
    setEra("");
    setTags("");
    setIsFormOpen(false);
  }

  function handleDeleteNote(id: string) {
    if(confirm("Delete this note entirely?")) {
      const updated = notes.filter((n) => n.id !== id);
      commit({ notes: updated }, "Purged Intel Record");
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <PageHeader
          title="Field Notes & Intel"
          description="A secure terminal to log personal insights, strategic overlaps, and verified intelligence."
        />
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-6 py-3 bg-alert-600/20 text-alert-500 border border-alert-500 font-black uppercase tracking-widest text-[10px] rounded-sm shadow-md hover:bg-alert-500 hover:text-military-950 transition hover:shadow-lg focus:ring-1 focus:ring-alert-400"
        >
          {isFormOpen ? "[ CLOSE TERMINAL ]" : "[ LOG NEW INTEL ]"}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-military-900/80 p-8 rounded-sm border border-alert-600/50 shadow-xl mb-12 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-alert-500/5 rounded-bl-[100px] border-l border-b border-alert-500/20 -mr-16 -mt-16 z-0 pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6 relative z-10 border-b border-military-700 pb-3">
            <h2 className="text-lg font-black tracking-widest uppercase text-alert-500 flex items-center gap-3">
               <span className="w-2 h-2 bg-alert-500 animate-pulse"></span>
               Initialize Note Record
            </h2>
            <UndoRedoControls showLabels />
          </div>
          <form onSubmit={handleAddNote} className="relative z-10">
            <div className="space-y-2 mb-8">
              <InputGroup label="Intel Identifier (Title)">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`${inputClass} text-sm font-bold`}
                  placeholder="[ ENTER ALPHA-NUMERIC DESIGNATION ]"
                  required
                />
              </InputGroup>
              <InputGroup label="Encrypted Observations">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`${inputClass} min-h-[160px] resize-y text-xs leading-relaxed`}
                  placeholder="[ RECORD INTELLIGENCE HERE... ]"
                  required
                />
              </InputGroup>
            </div>

            <fieldset className="border border-military-700 rounded-sm p-6 mb-8 bg-military-950/50 shadow-inner align-top relative mt-8">
              <legend className="text-[10px] font-black text-slate-300 px-3 bg-military-800 rounded-sm border border-military-600 shadow-sm ml-2 tracking-widest uppercase">Cross-Reference Metadata</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
                <InputGroup label="Link to Specific Operation (War)">
                  <select
                    className={`${inputClass} custom-select`}
                    value={linkedWarId}
                    onChange={(e) => setLinkedWarId(e.target.value)}
                  >
                    <option value="">[ UNLINKED / STANDALONE ]</option>
                    {wars.sort((a,b) => a.title.localeCompare(b.title)).map(w => (
                      <option key={w.id} value={w.id}>{w.title.toUpperCase()}</option>
                    ))}
                  </select>
                </InputGroup>
                <InputGroup label="Classification Tags (comma-separated)">
                  <input
                    className={inputClass}
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="[ E.G. ECONOMICS, DIPLOMACY ]"
                  />
                </InputGroup>
                <InputGroup label="Geographic Region">
                  <input
                    className={inputClass}
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="[ E.G. EUROPE THEATER ]"
                  />
                </InputGroup>
                <InputGroup label="Temporal Era">
                  <input
                    className={inputClass}
                    value={era}
                    onChange={(e) => setEra(e.target.value)}
                    placeholder="[ E.G. MODERN ERA ]"
                  />
                </InputGroup>
              </div>
            </fieldset>

            <button
              type="submit"
              className="w-full py-4 rounded-sm bg-intel-500/20 hover:bg-intel-500 text-intel-500 hover:text-military-950 border border-intel-500 font-black text-[10px] shadow-md hover:shadow-lg transition-all focus:outline-none uppercase tracking-widest mt-2"
            >
              [ COMMIT RECORD TO ARCHIVE ]
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-military-900/40 border border-military-800 border-dashed rounded-sm">
            <p className="font-mono tracking-widest uppercase text-military-500 mb-2">ARCHIVE EMPTY</p>
            <p className="text-slate-400 text-xs tracking-wider">Initialize a new record above.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-military-900/60 p-6 rounded-sm border border-military-700 shadow-md relative group hover:border-alert-600 hover:shadow-[0_0_15px_rgba(234,88,12,0.1)] transition-all flex flex-col h-full backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-military-600 m-2 group-hover:border-alert-500 transition-colors opacity-50"></div>
              
              <div className="flex justify-between items-start mb-5">
                <h3 className="text-sm font-black text-alert-500 leading-tight pr-6 uppercase tracking-widest border-l-2 border-alert-600 pl-3">{note.title}</h3>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-military-600 hover:text-red-500 transition-colors bg-military-950 rounded-sm p-1.5 border border-military-700 hover:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  title="Purge Record"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] font-mono font-bold tracking-widest text-slate-500 mb-4 uppercase">LOGGED: {new Date(note.createdAt).toLocaleDateString()}</p>
              <div className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed flex-grow mb-6 bg-military-950/40 p-4 border border-military-800/50 rounded-sm">{note.content}</div>
              
              <div className="mt-auto border-t border-military-800 pt-4 flex flex-wrap gap-2">
                {note.linkedWarId && wars.find(w => w.id === note.linkedWarId) && (
                  <span className="bg-intel-900/40 text-intel-400 px-2.5 py-1 rounded-sm text-[10px] font-mono font-bold border border-intel-800 shadow-inner align-middle">
                    OP: {wars.find(w => w.id === note.linkedWarId)?.title.toUpperCase()}
                  </span>
                )}
                {note.region && <span className="bg-military-800 text-military-400 px-2.5 py-1 text-[10px] font-mono font-bold uppercase border border-military-600 rounded-sm shadow-inner">REG: {note.region}</span>}
                {note.era && <span className="bg-military-800 text-military-400 px-2.5 py-1 text-[10px] font-mono font-bold uppercase border border-military-600 rounded-sm shadow-inner">ERA: {note.era}</span>}
                {note.tags && note.tags.map(t => (
                  <span key={t} className="bg-slate-800/50 text-slate-400 px-2 py-1 rounded-sm text-[10px] uppercase font-mono font-bold border border-slate-700 shadow-inner">[{t}]</span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}