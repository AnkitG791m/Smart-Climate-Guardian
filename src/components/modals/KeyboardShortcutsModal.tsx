import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: '/', description: 'Focus search bar & geocoder' },
  { key: '⌘ K', description: 'Quick city search' },
  { key: 'Esc', description: 'Close any active drawer or modal' },
  { key: '+ / -', description: 'Zoom map in / out' },
  { key: 'L', description: 'Toggle layers & basemap dock' },
  { key: 'A', description: 'Open Emergency Alert Center' },
  { key: 'R', description: 'File ground truth citizen report' },
  { key: 'N', description: 'Reset North & recenter city' },
  { key: 'M', description: 'Toggle audio sound cues on/off' },
  { key: 'T', description: 'Toggle Dark / Light theme' },
  { key: 'H', description: 'Toggle Hindi / English translation' },
  { key: 'C', description: 'Ask Gemini AI Climate Guardian (Voice Mode)' },
  { key: '?', description: 'View keyboard shortcuts guide' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-3xl shadow-2xl border border-slate-200/90 dark:border-emerald-800/80 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200/80 dark:border-emerald-950/80 bg-white/40 dark:bg-black/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Keyboard Navigation</h3>
              <p className="text-[11px] text-slate-400 font-medium">Power-user keyboard shortcuts</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-emerald-950/60 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[70vh] overflow-y-auto">
          {SHORTCUTS.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-black/30 border border-slate-100 dark:border-slate-800/80"
            >
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{sc.description}</span>
              <kbd className="px-2 py-1 rounded-lg bg-white dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-emerald-800 text-[10px] font-mono font-bold shadow-xs shrink-0 ml-2">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 text-center border-t border-slate-200/80 dark:border-emerald-950/80 bg-slate-50/50 dark:bg-black/40 text-[11px] text-slate-400 font-medium">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Esc</kbd> anytime to dismiss
        </div>
      </div>
    </div>
  );
};
