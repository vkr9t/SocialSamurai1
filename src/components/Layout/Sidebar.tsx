import React from 'react';
import {
  LayoutDashboard,
  Target,
  PenTool,
  Inbox,
  Calendar as CalendarIcon,
  BarChart3,
  Swords,
  Share2,
  Zap,
  Settings,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ViewTab } from '../../types';
import { SocialSamuraiLogo } from '../Common/SocialSamuraiLogo';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    subscription,
    usageLimits,
    accounts,
    setActiveUpgradeModal,
  } = useApp();

  const NAV_ITEMS: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'landing', label: 'Pitch / Hero Landing', icon: <Compass className="w-5 h-5" />, badge: 'NEW' },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Target className="w-5 h-5" />, badge: '7' },
    { id: 'create', label: 'Create Post', icon: <PenTool className="w-5 h-5" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-5 h-5" />, badge: '2' },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'battle', label: 'Shadow Fight ⚔️', icon: <Swords className="w-5 h-5" />, badge: '60s' },
    { id: 'connections', label: 'Connections', icon: <Share2 className="w-5 h-5" /> },
    { id: 'automation', label: 'Automation', icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#08080C] border-r border-white/10 sticky top-0 z-30 select-none font-sans">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <SocialSamuraiLogo size="sm" onClick={() => setCurrentView('landing')} />
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#1D1236] text-white border border-[#9333EA] shadow-[0_0_15px_rgba(147,51,234,0.35)]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#12121A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#C084FC]' : 'text-[#A1A1AA]'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    item.id === 'battle'
                      ? 'bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white animate-pulse'
                      : item.id === 'landing'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isActive
                      ? 'bg-[#9333EA]/30 text-[#C084FC] border border-[#9333EA]/50'
                      : 'bg-[#141420] text-[#A1A1AA]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Account Connection Status Summary */}
      <div className="px-4 py-3 bg-[#0D0D14] border-t border-b border-white/5 text-xs">
        <p className="text-[#A1A1AA] font-semibold mb-2 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C084FC]" /> Connected Feeds
        </p>
        <div className="space-y-1 text-[11px]">
          {accounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between">
              <span className="text-zinc-200 capitalize font-medium">{acc.platform === 'x' ? 'Twitter (𝕏)' : 'Reddit (r/)'}</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${acc.connected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-zinc-600'}`} />
                <span className={acc.connected ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                  {acc.connected ? 'Active' : 'Offline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mascot & Subscription Widget */}
      <div className="p-4 bg-[#0B0B10] border-t border-white/10 space-y-3">
        {/* Credits Status */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#A1A1AA] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" /> Samurai Credits
          </span>
          <span className="font-bold text-white bg-[#181528] px-2 py-0.5 rounded-lg border border-[#9333EA]/30">
            {subscription.plan === 'samurai' ? 'UNLIMITED ⚔️' : `${usageLimits.dailyCreditsCount} / ${usageLimits.dailyCreditsMax}`}
          </span>
        </div>

        {/* Samurai Card */}
        <div className="flex items-center gap-3 bg-[#141220] p-2.5 rounded-2xl border border-purple-500/20">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#9333EA] shrink-0">
            <img src="/hero_samurai.jpg" alt="Mascot" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black font-heading text-white truncate uppercase">
              {subscription.plan === 'samurai' ? 'SAMURAI MASTER ⚔️' : 'FREE DOJO INITIATE'}
            </p>
            <p className="text-[10px] text-[#A1A1AA] truncate">
              {subscription.plan === 'samurai' ? 'All capabilities unlocked' : '3 daily ops · 10 credits'}
            </p>
          </div>
        </div>

        {subscription.plan === 'free' && (
          <button
            onClick={() => setActiveUpgradeModal(true)}
            className="w-full py-2.5 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#9333EA]/30 transition-all flex items-center justify-center gap-1.5"
          >
            <span>BECOME A SAMURAI — $19</span>
          </button>
        )}

        <button
          onClick={() => setCurrentView('settings')}
          className="w-full flex items-center justify-center gap-2 py-1 text-xs text-[#A1A1AA] hover:text-white transition"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings & API Keys</span>
        </button>
      </div>
    </aside>
  );
};

