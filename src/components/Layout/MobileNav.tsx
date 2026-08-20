import React from 'react';
import { LayoutDashboard, Target, PenTool, Inbox, Swords, Share2, Calendar, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const NAV_ITEMS: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'landing', label: 'Hero', icon: <Compass className="w-5 h-5" /> },
    { id: 'dashboard', label: 'Dojo', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'opportunities', label: 'Ops', icon: <Target className="w-5 h-5" />, badge: '7' },
    { id: 'create', label: 'Create', icon: <PenTool className="w-5 h-5" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-5 h-5" /> },
    { id: 'battle', label: 'Shadow', icon: <Swords className="w-5 h-5" />, badge: '⚔️' },
    { id: 'connections', label: 'Feeds', icon: <Share2 className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080C]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 select-none font-sans">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`relative flex flex-col items-center py-1 px-2 rounded-xl transition-all duration-200 ${
                isActive ? 'text-[#C084FC]' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] font-extrabold bg-[#9333EA] text-white px-1 rounded-full animate-pulse shadow-sm shadow-purple-500">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
              {isActive && (
                <span className="w-4 h-0.5 bg-[#9333EA] rounded-full mt-0.5 shadow-sm shadow-[#9333EA]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

