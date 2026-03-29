import UndoRedoControls from "../shared/UndoRedoControls";

export default function Topbar() {
  return (
    <div className="mb-6 rounded-sm border border-alert-600/50 bg-alert-500/10 p-4 shadow-md backdrop-blur-sm border-l-4 border-l-alert-500 flex items-center justify-between gap-3">
      <p className="text-xs font-mono font-bold uppercase tracking-widest text-alert-500">
        [SECURE CONNECTION] Offline-first research active. Local persistence verified.
      </p>
      <UndoRedoControls showLabels />
    </div>
  );
}