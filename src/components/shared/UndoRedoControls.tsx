"use client";

import { useHistory } from "@/context/HistoryContext";

export default function UndoRedoControls({ showLabels = false }: { showLabels?: boolean }) {
  const { undo, redo, canUndo, canRedo } = useHistory();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border transition-all font-black text-[10px] uppercase tracking-widest
          ${canUndo 
            ? "bg-military-800 text-alert-500 border-alert-600/50 hover:bg-alert-500 hover:text-military-950 shadow-sm" 
            : "bg-military-900/50 text-military-600 border-military-800 cursor-not-allowed opacity-50"
          }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
        {showLabels && <span>Undo</span>}
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border transition-all font-black text-[10px] uppercase tracking-widest
          ${canRedo 
            ? "bg-military-800 text-intel-500 border-intel-600/50 hover:bg-intel-500 hover:text-military-950 shadow-sm" 
            : "bg-military-900/50 text-military-600 border-military-800 cursor-not-allowed opacity-50"
          }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
        </svg>
        {showLabels && <span>Redo</span>}
      </button>
    </div>
  );
}
