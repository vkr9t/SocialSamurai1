import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Sparkles, X } from 'lucide-react';
import { sounds } from '../../utils/audio';

export const PricingModal: React.FC = () => {
  const { activeUpgradeModal, setActiveUpgradeModal, upgradeSubscription } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!activeUpgradeModal) return null;

  const handleUpgrade = () => {
    sounds.playClick();
    upgradeSubscription(billingCycle);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08080C]/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto font-sans select-none">
      <div className="max-w-3xl w-full bg-[#12121A] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => setActiveUpgradeModal(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#181528] text-[#A1A1AA] hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot & Headline */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#1A112E] border-2 border-[#9333EA] p-2 shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center text-3xl mb-3">
            ⚔️
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight uppercase">
            Choose Your Path
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 max-w-md mx-auto">
            Unlock the full battlefield. Unlimited AI replies, multi-agent personality tuning, and live keyword radar.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center bg-[#08080C] border border-white/10 p-1.5 rounded-2xl mt-5 text-xs font-bold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl transition ${
                billingCycle === 'monthly' ? 'bg-[#181528] text-white font-semibold' : 'text-[#A1A1AA]'
              }`}
            >
              Monthly Billing ($19/mo)
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-[#9333EA] text-white shadow-md shadow-[#9333EA]/30' : 'text-[#A1A1AA]'
              }`}
            >
              <span>Yearly ($140/yr)</span>
              <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-md font-extrabold">SAVE 39%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {/* FREE PLAN CARD */}
          <div className="bg-[#0D0D14] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-black text-[#A1A1AA] uppercase tracking-wider font-heading">
                FREE DOJO INITIATE
              </span>
              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl font-black text-white font-heading">$0</span>
                <span className="text-xs text-[#A1A1AA]">/month</span>
              </div>
              <p className="text-xs text-[#A1A1AA] mb-4">Essential opportunity discovery for starters.</p>

              <div className="space-y-2.5 text-xs text-zinc-300 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> 2 Connected Accounts (X + Reddit)
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> 3 AI Opportunities / Day
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> 10 Daily Arcade Credits
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Anti-AI Slop Scoring
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveUpgradeModal(false)}
              className="mt-6 w-full py-3 bg-[#141420] border border-white/10 hover:bg-[#1E1E30] text-white font-bold text-xs rounded-2xl transition"
            >
              Current Active Plan
            </button>
          </div>

          {/* SAMURAI PLAN CARD (Emphasized) */}
          <div className="bg-gradient-to-br from-[#1A112E] via-[#141222] to-[#25133E] border-2 border-[#9333EA] rounded-3xl p-6 flex flex-col justify-between relative shadow-2xl shadow-[#9333EA]/30">
            <span className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full shadow-lg uppercase">
              MOST POPULAR ⚔️
            </span>

            <div>
              <span className="text-xs font-black text-[#C084FC] uppercase tracking-wider flex items-center gap-1 font-heading">
                <Sparkles className="w-3.5 h-3.5" /> SAMURAI MASTER
              </span>

              <div className="flex items-baseline gap-1 my-2">
                <span className="text-3xl font-black text-white font-heading">
                  {billingCycle === 'yearly' ? '$140' : '$19'}
                </span>
                <span className="text-xs text-[#E9D5FF]">
                  {billingCycle === 'yearly' ? '/year ($11.6/mo)' : '/month'}
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] mb-4">Complete command center with unlimited AI actions.</p>

              <div className="space-y-2.5 text-xs text-zinc-200 border-t border-purple-500/20 pt-4">
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#C084FC] shrink-0" /> Unlimited Daily Opportunities
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#C084FC] shrink-0" /> All 6 Multi-Agent Samurai Archetypes
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#C084FC] shrink-0" /> Automated Background Surveillance
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#C084FC] shrink-0" /> 1-Click Scheduled Publishing
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#C084FC] shrink-0" /> Unlimited Shadow Arena Credits
                </div>
              </div>
            </div>

            <button
              onClick={handleUpgrade}
              className="mt-6 w-full py-3.5 bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#9333EA]/40 transition active:scale-95 border border-purple-400/30"
            >
              BECOME A SAMURAI ⚔️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

