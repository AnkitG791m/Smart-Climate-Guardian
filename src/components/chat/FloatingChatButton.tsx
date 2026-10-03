import React from 'react';
import { Bot, Sparkles, Mic, Volume2 } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <div className="absolute right-4 bottom-52 z-30 flex items-center">
      <button
        onClick={() => {
          soundService.playClick();
          onClick();
        }}
        className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl glass-panel shadow-2xl border border-emerald-500/40 hover:border-emerald-400 bg-gradient-to-r from-forest-950/80 via-black/80 to-emerald-950/80 text-white transition-all transform hover:scale-105 hover:shadow-eco-glow"
        title="Ask Prithvi AI Guardian (Voice Mode & Audio Speak) [C]"
      >
        {/* Glowing Pulsing Avatar */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-forest-700 text-white shadow-eco-sm">
          <Bot className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-pulse" />
        </div>

        {/* Text and Voice badge */}
        <div className="text-left font-sans hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white tracking-tight">Ask Prithvi AI</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/30">
              Voice
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            Speak / Listen • Gemini
          </span>
        </div>

        <div className="flex items-center gap-1 text-emerald-400 ml-1">
          <Mic className="w-3.5 h-3.5 group-hover:animate-bounce" />
          <Volume2 className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
