import React, { useState, useEffect } from 'react';
import { Opportunity } from '../../types';
import { useApp } from '../../context/AppContext';
import { Sparkles, Shield, RefreshCw, CheckCircle2, X, Send, Sliders } from 'lucide-react';
import { sounds } from '../../utils/audio';

export const ReplyModal: React.FC = () => {
  const { activeReplyModal, setActiveReplyModal, approveAndPublishReply } = useApp();

  const [selectedTone, setSelectedTone] = useState<'The Hunter' | 'The Strategist' | 'The Creator' | 'The Sensei'>('The Hunter');
  const [draftText, setDraftText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Pre-generate drafts for the 4 tones
  const TONE_DRAFTS: Record<'The Hunter' | 'The Strategist' | 'The Creator' | 'The Sensei', string> = {
    'The Hunter':
      "SocialSamurai solves this instantly. It uses real-time intent filters on X & Reddit to surface founders actively looking for solutions, cutting through all generic noise in 2 clicks.",
    'The Strategist':
      "Evaluating intent discovery requires two core pillars: heuristic intent scoring and strict rate limit compliance. SocialSamurai applies OAuth 2.0 PKCE with local heuristic LLM ranking.",
    'The Creator':
      "Love this thread! The game changer for us was turning outbound hunting into inbound problem-solving. Find people asking questions in your domain and share actionable teardowns.",
    'The Sensei':
      "Mastery in social growth comes from discipline over automation. Focus on 5 high-intent conversations daily where you can offer genuine architecture breakdowns rather than spamming keywords.",
  };

  useEffect(() => {
    if (activeReplyModal) {
      setDraftText(TONE_DRAFTS['The Hunter']);
      setSelectedTone('The Hunter');
      setShowCelebration(false);
    }
  }, [activeReplyModal]);

  if (!activeReplyModal) return null;

  const handleSelectTone = (tone: 'The Hunter' | 'The Strategist' | 'The Creator' | 'The Sensei') => {
    sounds.playClick();
    setSelectedTone(tone);
    setIsGenerating(true);
    setTimeout(() => {
      setDraftText(TONE_DRAFTS[tone]);
      setIsGenerating(false);
    }, 250);
  };

  const handleRegenerate = () => {
    sounds.playClick();
    setIsGenerating(true);
    setTimeout(() => {
      setDraftText(
        `${TONE_DRAFTS[selectedTone]} (Optimized with Anti-AI Slop Heuristics for maximum founder trust)`
      );
      setIsGenerating(false);
    }, 350);
  };

  const handleApprove = () => {
    const success = approveAndPublishReply(activeReplyModal.id, draftText);
    if (success) {
      setShowCelebration(true);
      setTimeout(() => {
        setActiveReplyModal(null);
      }, 1800);
    }
  };

  const charLimit = activeReplyModal.platform === 'x' ? 280 : 1000;
  const charCount = draftText.length;

  return (
    <div className="fixed inset-0 z-50 bg-[#08080C]/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto font-sans select-none">
      <div className="max-w-2xl w-full bg-[#12121A] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto">
        {/* Close Button */}
        <button
          onClick={() => setActiveReplyModal(null)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#181528] text-[#A1A1AA] hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {showCelebration ? (
          <div className="text-center py-10 space-y-4 animate-in zoom-in-95">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-[#1A112E] border-2 border-[#9333EA] p-2 shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center text-4xl">
              ⚔️
            </div>
            <h2 className="text-3xl font-black text-white font-heading uppercase">Clean Strike Published! ⚔️</h2>
            <p className="text-sm text-[#A1A1AA] max-w-md mx-auto">
              Your AI-crafted reply has been approved & queued for publishing through your authorized connection.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold font-mono">
              <CheckCircle2 className="w-4 h-4" /> QUEUED FOR PUBLISHING
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#9333EA] shrink-0">
                <img src="/hero_samurai.jpg" alt="Mascot" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#C084FC] uppercase font-heading tracking-wider">SAMURAI STRIKE STUDIO</span>
                  <span className="text-[10px] bg-[#9333EA]/30 text-[#E9D5FF] px-2 py-0.5 rounded-full font-bold">
                    COST: 5 CREDITS
                  </span>
                </div>
                <h2 className="text-xl font-black text-white font-heading uppercase">Craft High-Conversion Strike</h2>
              </div>
            </div>

            {/* Pinned Original Post */}
            <div className="bg-[#0A0A10] border border-white/10 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between text-xs text-[#A1A1AA] mb-2">
                <span className="font-bold text-white font-heading">Replying to {activeReplyModal.authorHandle}</span>
                <span className="uppercase text-[10px] font-mono text-[#C084FC]">{activeReplyModal.platform}</span>
              </div>
              <p className="text-xs text-zinc-300 italic leading-relaxed">
                "{activeReplyModal.postContent}"
              </p>
            </div>

            {/* Tone Selector Tabs */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-2">Select Samurai Persona Voice:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['The Hunter', 'The Strategist', 'The Creator', 'The Sensei'] as const).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => handleSelectTone(tone)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      selectedTone === tone
                        ? 'bg-[#9333EA] border-[#9333EA] text-white shadow-lg shadow-[#9333EA]/30'
                        : 'bg-[#181528] border-white/10 text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generated & Human Review Required Badges */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-[#C084FC] border border-purple-500/40">
                  ⚡ ANTI-AI SLOP VERIFIED
                </span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  🛡️ 1-TAP APPROVAL
                </span>
              </div>

              <span
                className={`text-xs font-mono font-bold ${
                  charCount > charLimit ? 'text-rose-500' : 'text-[#A1A1AA]'
                }`}
              >
                {charCount} / {charLimit}
              </span>
            </div>

            {/* Editable Text Area with Left Accent Bar */}
            <div className="relative mb-6">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#9333EA] rounded-l-2xl" />
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                disabled={isGenerating}
                rows={4}
                className="w-full bg-[#0A0A10] border border-white/10 rounded-2xl pl-5 pr-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-[#9333EA] transition leading-relaxed resize-none font-sans"
              />
            </div>

            {/* Quick Adjusters */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegenerate}
                  className="px-3 py-1.5 bg-[#181528] border border-white/10 hover:border-purple-500/30 text-[#A1A1AA] hover:text-white rounded-xl transition flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-[#C084FC]' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>

              <span className="text-[11px] text-[#A1A1AA]">
                Strict Human Authorization before post execution.
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleApprove}
              disabled={charCount === 0 || charCount > charLimit}
              className="w-full py-4 bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-[#9333EA]/40 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 border border-purple-400/30"
            >
              <Send className="w-4 h-4 fill-white" />
              <span>APPROVE & STRIKE ⚔️</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

