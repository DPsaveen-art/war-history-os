import { sampleWars } from "@/data/sampleWars";
import { War } from "@/types/war";
import { Note } from "@/types/note";

const STORAGE_KEY = "war-history-os-data";
const STORAGE_KEY_NOTES = "war-history-os-notes";

export function getWars(): War[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleWars));
    return sampleWars;
  }

  try {
    return JSON.parse(raw) as War[];
  } catch {
    return [];
  }
}

export function saveWars(wars: War[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wars));
}

export function getWarById(id: string): War | undefined {
  const wars = getWars();
  return wars.find((w) => w.id === id);
}

export function updateWar(updatedWar: War) {
  const wars = getWars();
  const index = wars.findIndex((w) => w.id === updatedWar.id);
  if (index !== -1) {
    wars[index] = { ...updatedWar, updatedAt: new Date().toISOString() };
    saveWars(wars);
  }
}

export function deleteWar(id: string) {
  const wars = getWars();
  const filtered = wars.filter((w) => w.id !== id);
  saveWars(filtered);
}

export function resetWars() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleWars));
}

// === Notes ===

export function getNotes(): Note[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) return [];
  
  try {
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
}

export function updateNote(updatedNote: Note) {
  const notes = getNotes();
  const index = notes.findIndex((n) => n.id === updatedNote.id);
  if (index !== -1) {
    notes[index] = { ...updatedNote, updatedAt: new Date().toISOString() };
    saveNotes(notes);
  }
}

export function deleteNote(id: string) {
  const notes = getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  saveNotes(filtered);
}