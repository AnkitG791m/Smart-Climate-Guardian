import React from 'react';
import { 
  Home, 
  Compass, 
  Table as TableIcon, 
  Users, 
  MessageSquare, 
  Bell,
  Sparkles
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export type MobileTab = 'home' | 'map' | 'records' | 'citizen' | 'chat';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  unreadAlertsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onChangeTab,
  unreadAlertsCount = 2,
}) => {
  const navItems: { id: MobileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Compass },
    { id: 'records', label: 'Stations', icon: TableIcon },
    { id: 'citizen', label: 'Ground', icon: Users },
    { id: 'chat', label: 'AI Voice', icon: Sparkles },
  ];

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 pointer-events-auto">
      <nav 
        aria-label="Mobile Navigation"
        className="bg-white/95 dark:bg-[#131d2e]/95 backdrop-blur-2xl rounded-full px-3 py-2 shadow-2xl border border-slate-200/90 dark:border-blue-900/40 flex items-center justify-center gap-1.5"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundService.playClick();
                onChangeTab(item.id);
              }}
              className={`relative flex items-center gap-1.5 py-1.5 px-3.5 rounded-full transition-all duration-200 ${
                isActive
                  ? 'bg-[#2F80ED] text-white font-black shadow-md scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-[#2F80ED] font-bold'
              }`}
            >
              <Icon className="w-4 h-4" />
              {isActive && (
                <span className="text-[11px] font-extrabold tracking-tight">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
