import React from 'react';
import {
  Target,
  FileText,
  Calendar,
  Sparkles,
  Swords,
  TrendingUp,
  Brain,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from '../Opportunities/OpportunityCard';

export const DashboardView: React.FC = () => {
  const {
    opportunities,
    scheduledPosts,
    subscription,
    usageLimits,
    setCurrentView,
    scanForOpportunities,
    setActiveUpgradeModal,
  } = useApp();

  const activeOpps = opportunities.filter((o) => !o.dismissed);
  const topOpps = activeOpps.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none font-sans">
      {/* Top Greeting & Command Center Header */}
      <div className="bg-[#12121A] border border-purple-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9333EA]/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#1A112E] border-2 border-[#9333EA] overflow-hidden shadow-[0_0_20px_rgba(147,51,234,0.4)] shrink-0">
              <img src="/hero_samurai.jpg" alt="Mascot" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-[#C084FC] uppercase tracking-wider">
                  COMMAND CENTER ACTIVE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight uppercase">
                Good morning, Vikrant.
              </h1>
              <p className="text-sm text-[#A1A1AA] mt-0.5">
                Your dojo is ready. 7 high-intent conversations waiting across your connected networks.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={scanForOpportunities}
              className="flex-1 md:flex-initial py-3 px-6 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-[#9333EA]/30 transition-all flex items-center justify-center gap-2 active:scale-95 border border-purple-400/30"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>SCAN BATTLEFIELD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counter Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Opportunities Stat */}
        <div
          onClick={() => setCurrentView('opportunities')}
          className="bg-[#12121A] border border-white/10 hover:border-[#9333EA]/60 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#9333EA]/15 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A1A1AA]">Opportunities</span>
            <div className="w-8 h-8 rounded-xl bg-[#9333EA]/20 border border-[#9333EA]/40 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">{activeOpps.length}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> 3 new this hour
          </p>
        </div>

        {/* AI Drafts Stat */}
        <div
          onClick={() => setCurrentView('opportunities')}
          className="bg-[#12121A] border border-white/10 hover:border-[#9333EA]/60 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#9333EA]/15 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A1A1AA]">AI Drafts Ready</span>
            <div className="w-8 h-8 rounded-xl bg-[#9333EA]/20 border border-[#9333EA]/40 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">12</p>
          <p className="text-[11px] text-[#A1A1AA] mt-1">Review & approve</p>
        </div>

        {/* Scheduled Stat */}
        <div
          onClick={() => setCurrentView('calendar')}
          className="bg-[#12121A] border border-white/10 hover:border-[#9333EA]/60 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#9333EA]/15 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A1A1AA]">Scheduled</span>
            <div className="w-8 h-8 rounded-xl bg-[#9333EA]/20 border border-[#9333EA]/40 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">{scheduledPosts.length}</p>
          <p className="text-[11px] text-[#A1A1AA] mt-1">Next post in 2h 15m</p>
        </div>

        {/* Credits Stat */}
        <div
          onClick={() => subscription.plan === 'free' && setActiveUpgradeModal(true)}
          className="bg-[#12121A] border border-white/10 hover:border-[#9333EA]/60 rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#9333EA]/15 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A1A1AA]">Samurai Credits</span>
            <div className="w-8 h-8 rounded-xl bg-[#9333EA]/20 border border-[#9333EA]/40 flex items-center justify-center text-[#C084FC] group-hover:scale-110 transition">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-heading">
            {subscription.plan === 'samurai' ? '∞' : usageLimits.dailyCreditsCount}
          </p>
          <p className="text-[11px] text-[#C084FC] mt-1 font-semibold flex items-center gap-1">
            {subscription.plan === 'samurai' ? 'Unlimited Samurai' : 'Play Battle to earn +10'}
          </p>
        </div>
      </div>

      {/* TODAY'S BATTLE BANNER */}
      <div className="bg-gradient-to-r from-[#170E2B] via-[#12121A] to-[#1F1138] border border-[#9333EA]/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#9333EA] flex items-center justify-center text-white shadow-lg shadow-[#9333EA]/50 animate-pulse">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#C084FC] uppercase font-heading tracking-wider">TODAY'S BATTLE</span>
              <span className="text-[10px] bg-[#9333EA]/30 text-[#E9D5FF] px-2 py-0.5 rounded-full font-bold">
                EARN +10 CREDITS
              </span>
            </div>
            <h3 className="text-lg font-black text-white font-heading uppercase mt-0.5">
              60 Seconds. Shadow Fight Arcade.
            </h3>
            <p className="text-xs text-[#A1A1AA]">
              Test your reflexes against Shadow Shinobi & Slop Titans to refill your daily AI quota.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('battle')}
          className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-[#9333EA]/40 transition flex items-center justify-center gap-2 shrink-0 active:scale-95 border border-purple-400/40"
        >
          <span>ENTER THE ARENA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* TODAY'S OPPORTUNITIES FEED */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-white font-heading tracking-tight uppercase flex items-center gap-2">
              <Target className="w-5 h-5 text-[#C084FC]" /> TODAY'S OPPORTUNITIES
            </h2>
            <p className="text-xs text-[#A1A1AA]">High-intent conversations detected in your niche.</p>
          </div>

          <button
            onClick={() => setCurrentView('opportunities')}
            className="text-xs font-bold text-[#C084FC] hover:underline flex items-center gap-1"
          >
            <span>View All ({activeOpps.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {topOpps.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      </div>

      {/* SAMURAI INTELLIGENCE CARD */}
      <div className="bg-[#12121A] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-[#C084FC] shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C084FC] uppercase">SAMURAI INTELLIGENCE</span>
              <span className="text-[10px] bg-[#9333EA]/20 text-[#E9D5FF] px-2 py-0.5 rounded-full font-bold">
                AI PATTERN MATCH
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              "Your technical build posts are generating 2.7× more engagement than promotional announcements."
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
              Based on analyzing your last 45 replies across X and Reddit, posts containing specific architecture frameworks outperform generic advice.
            </p>
            <button
              onClick={() => setCurrentView('analytics')}
              className="mt-4 px-4 py-2 bg-[#171724] border border-white/10 hover:border-purple-400/50 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <span>View Insights & AI Memory</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C084FC]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

