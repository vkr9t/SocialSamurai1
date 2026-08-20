import React, { useState } from 'react';
import { Target, Zap, Filter, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from './OpportunityCard';
import { PlatformType } from '../../types';
import { EmptyState } from '../Common/EmptyState';

export const OpportunitiesView: React.FC = () => {
  const { opportunities, scanForOpportunities } = useApp();
  const [platformFilter, setPlatformFilter] = useState<'all' | PlatformType>('all');
  const [sortBy, setSortBy] = useState<'match' | 'newest' | 'engagement'>('match');

  const filteredOpps = opportunities
    .filter((o) => !o.dismissed)
    .filter((o) => (platformFilter === 'all' ? true : o.platform === platformFilter))
    .sort((a, b) => {
      if (sortBy === 'match') return b.opportunityScore - a.opportunityScore;
      if (sortBy === 'engagement') return b.engagement.likes - a.engagement.likes;
      return 0; // default order
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#12121A] border border-purple-500/30 p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight uppercase">
              Opportunity Battlefield
            </h1>
            <span className="text-xs bg-[#9333EA]/30 text-[#E9D5FF] px-3 py-1 rounded-full font-bold font-mono">
              {filteredOpps.length} ACTIVE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Conversations worth your attention. AI curated & intent scored in real-time.
          </p>
        </div>

        <button
          onClick={scanForOpportunities}
          className="py-3.5 px-6 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-[#9333EA]/30 transition flex items-center justify-center gap-2 shrink-0 active:scale-95 border border-purple-400/30"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>RUN LIVE RADAR SCAN</span>
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#12121A] border border-white/10 p-3 rounded-2xl">
        {/* Platform Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'x', 'reddit'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition uppercase whitespace-nowrap font-heading ${
                platformFilter === p
                  ? 'bg-[#9333EA] text-white shadow-md shadow-[#9333EA]/30'
                  : 'bg-[#0A0A10] text-[#A1A1AA] hover:text-white'
              }`}
            >
              {p === 'all' ? 'All Battlefield' : p === 'x' ? '𝕏 Twitter' : 'Reddit (r/)'}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-[#A1A1AA]">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#C084FC]" />
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'match' | 'newest' | 'engagement')}
            className="bg-[#0A0A10] border border-white/10 text-white font-semibold px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#9333EA]"
          >
            <option value="match">Best Intent Score</option>
            <option value="newest">Newest First</option>
            <option value="engagement">Highest Engagement</option>
          </select>
        </div>
      </div>

      {/* Feed List */}
      {filteredOpps.length === 0 ? (
        <EmptyState
          title="The battlefield is quiet."
          subtitle="No opportunities match your current filter. Run a fresh scan or adjust your keywords."
          mascotState="thinking"
          actionLabel="Run AI Scan"
          onAction={scanForOpportunities}
        />
      ) : (
        <div className="space-y-4">
          {filteredOpps.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
};
