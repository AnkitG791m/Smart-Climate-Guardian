import React, { useState, useRef, useEffect } from 'react';
import { Bot, Mic, Volume2, GripVertical } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, isOpen }) => {
  // Store draggable coordinates (null means initial default position)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    moved: false,
  });
  const buttonRef = useRef<HTMLDivElement>(null);

  // Set safe default position once mounted (bottom-right above the status bar, avoiding cards)
  useEffect(() => {
    if (typeof window !== 'undefined' && position === null) {
      const defaultX = Math.max(20, window.innerWidth - 260);
      const defaultY = Math.max(100, window.innerHeight - 150);
      setPosition({ x: defaultX, y: defaultY });
    }
  }, [position]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect.left,
      initialY: rect.top,
      moved: false,
    };
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      dragStartRef.current.moved = true;
    }

    const buttonWidth = buttonRef.current?.offsetWidth || 220;
    const buttonHeight = buttonRef.current?.offsetHeight || 50;

    const newX = Math.min(
      Math.max(10, dragStartRef.current.initialX + deltaX),
      window.innerWidth - buttonWidth - 10
    );
    const newY = Math.min(
      Math.max(10, dragStartRef.current.initialY + deltaY),
      window.innerHeight - buttonHeight - 10
    );

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was already released
    }

    // If pointer barely moved, count it as a clean click
    if (!dragStartRef.current.moved) {
      soundService.playClick();
      onClick();
    }
  };

  if (isOpen) return null;

  return (
    <div
      ref={buttonRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'fixed',
        left: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        right: position ? undefined : '24px',
        bottom: position ? undefined : '90px',
        touchAction: 'none',
      }}
      className={`z-40 select-none transition-shadow ${
        isDragging ? 'cursor-grabbing scale-105 shadow-2xl opacity-95' : 'cursor-grab hover:scale-102'
      }`}
    >
      <div
        className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 transition-all hover:border-sky-400 hover:shadow-2xl"
        title="Drag anywhere to move • Tap to Ask Prithvi AI Guardian [C]"
      >
        {/* Drag Grip Handle */}
        <div className="flex items-center text-slate-300 dark:text-slate-600 group-hover:text-slate-400">
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        {/* Glowing Pulsing Avatar */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md">
          <Bot className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
        </div>

        {/* Text and Voice badge */}
        <div className="text-left font-sans">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">Ask Prithvi AI</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono text-[9px] font-bold border border-emerald-300 dark:border-emerald-800">
              Voice
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
            Speak / Listen • Gemini
          </span>
        </div>

        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 ml-1">
          <Mic className="w-3.5 h-3.5 group-hover:animate-bounce" />
          <Volume2 className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
