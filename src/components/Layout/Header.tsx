import React, { useState } from 'react';
import { Bell, Sparkles, Shield, ToggleLeft, ToggleRight, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SocialSamuraiLogo } from '../Common/SocialSamuraiLogo';

export const Header: React.FC = () => {
  const {
    subscription,
    usageLimits,
    notifications,
    markNotificationRead,
    demoMode,
    toggleDemoMode,
    setActiveUpgradeModal,
    setCurrentView,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-[#08080C]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between select-none font-sans">
      {/* Left side brand on mobile / Page context on desktop */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <SocialSamuraiLogo size="sm" />
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs">
          <button
            onClick={() => setCurrentView('landing')}
            className="px-3 py-1 rounded-xl bg-[#141220] border border-purple-500/30 text-[#C084FC] hover:text-white flex items-center gap-1.5 transition text-xs font-semibold"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Pitch Landing Page</span>
          </button>

          <span className="text-white/20">|</span>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[#A1A1AA] font-mono text-[11px]">SAMURAI RADAR: ACTIVE</span>
          </div>

          <span className="text-white/20">|</span>

          <span className="text-[#A1A1AA]">
            {subscription.plan === 'samurai' ? (
              <span className="text-[#C084FC] font-bold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 inline" /> SAMURAI PRO ⚔️
              </span>
            ) : (
              <span className="text-amber-400 font-medium">FREE INITIATE (3 Ops / Day)</span>
            )}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Demo Mode Toggle */}
        <button
          onClick={toggleDemoMode}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141420] border border-white/10 text-[11px] font-semibold text-[#A1A1AA] hover:text-white transition"
          title="Toggle between Demo Mode and Real API feed"
        >
          {demoMode ? (
            <ToggleRight className="w-4 h-4 text-[#C084FC]" />
          ) : (
            <ToggleLeft className="w-4 h-4 text-zinc-500" />
          )}
          <span className="hidden sm:inline">MODE:</span>
          <span className={demoMode ? 'text-[#C084FC] font-bold' : 'text-zinc-400'}>
            {demoMode ? 'SIMULATOR' : 'LIVE'}
          </span>
        </button>

        {/* Credits Badge */}
        <button
          onClick={() => subscription.plan === 'free' && setActiveUpgradeModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181528] border border-[#9333EA]/50 text-xs font-bold text-white hover:border-[#C084FC] transition shadow-md shadow-[#9333EA]/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>
            {subscription.plan === 'samurai' ? 'UNLIMITED ⚔️' : `${usageLimits.dailyCreditsCount} CREDITS`}
          </span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-[#141420] border border-white/10 text-[#A1A1AA] hover:text-white hover:border-purple-500/40 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9333EA] text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse shadow-sm shadow-purple-500">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#12121A] border border-purple-500/30 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#C084FC]" /> Notifications
                </span>
                <span className="text-[10px] text-[#A1A1AA]">{notifications.length} alerts</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      n.read
                        ? 'bg-[#0A0A10] border-white/5 opacity-70'
                        : 'bg-[#181528] border-[#9333EA]/40 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-white font-semibold mb-1">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-[#A1A1AA]">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#A1A1AA] leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div
          className="cursor-pointer w-8 h-8 rounded-full overflow-hidden border border-[#9333EA] shadow-md shadow-[#9333EA]/30"
          onClick={() => setCurrentView('settings')}
        >
          <img src="/hero_samurai.jpg" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

