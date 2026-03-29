"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { War } from "@/types/war";
import { Note } from "@/types/note";
import { getWars, saveWars, getNotes, saveNotes } from "@/lib/storage";

interface AppState {
  wars: War[];
  notes: Note[];
  draftWar?: Partial<War>;
  draftNote?: Partial<Note>;
}

interface HistoryContextType {
  state: AppState;
  undo: () => void;
  redo: () => void;
  commit: (newState: Partial<AppState>, label?: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  lastActionLabel?: string;
  isUndoingRedoing: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const MAX_HISTORY = 100;

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState({
    past: [] as AppState[],
    present: { wars: [], notes: [] } as AppState,
    future: [] as AppState[]
  });
  
  const [lastActionLabel, setLastActionLabel] = useState<string | undefined>();
  const [isUndoingRedoing, setIsUndoingRedoing] = useState(false);
  const isInitialMount = useRef(true);

  // Initialize from LocalStorage
  useEffect(() => {
    const initialWars = getWars();
    const initialNotes = getNotes();
    setHistory(h => ({
      ...h,
      present: { wars: initialWars, notes: initialNotes }
    }));
    isInitialMount.current = false;
  }, []);

  // Sync to LocalStorage (Only persist wars/notes, not drafts)
  useEffect(() => {
    if (isInitialMount.current) return;
    saveWars(history.present.wars);
    saveNotes(history.present.notes);
  }, [history.present.wars, history.present.notes]);

  const commit = useCallback((newState: Partial<AppState>, label?: string) => {
    setHistory((h) => {
      const newPast = [...h.past, h.present];
      const limitedPast = newPast.length > MAX_HISTORY 
        ? newPast.slice(newPast.length - MAX_HISTORY) 
        : newPast;
        
      return {
        past: limitedPast,
        present: { ...h.present, ...newState },
        future: []
      };
    });
    setLastActionLabel(label);
  }, []);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;

      setIsUndoingRedoing(true);
      const previous = h.past[h.past.length - 1];
      const newPast = h.past.slice(0, h.past.length - 1);

      setTimeout(() => setIsUndoingRedoing(false), 50);

      return {
        past: newPast,
        present: previous,
        future: [h.present, ...h.future]
      };
    });
    setLastActionLabel(undefined);
  }, []);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h;

      setIsUndoingRedoing(true);
      const next = h.future[0];
      const newFuture = h.future.slice(1);

      setTimeout(() => setIsUndoingRedoing(false), 50);

      return {
        past: [...h.past, h.present],
        present: next,
        future: newFuture
      };
    });
    setLastActionLabel(undefined);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" || e.key === "Z") {
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (e.key === "y" || e.key === "Y") {
          redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <HistoryContext.Provider
      value={{
        state: history.present,
        undo,
        redo,
        commit,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
        lastActionLabel,
        isUndoingRedoing,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}
