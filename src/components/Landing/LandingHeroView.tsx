import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  ArrowRight,
  Shield,
  Zap,
  Users,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Swords,
  ChevronDown,
  Target,
  Flame,
  Brain,
  Sliders,
  Send,
  ExternalLink,
  Award,
} from 'lucide-react';
import { SocialSamuraiLogo } from '../Common/SocialSamuraiLogo';
import { useApp } from '../../context/AppContext';
import { SAMURAI_ARCHETYPES } from '../../data/samuraiArchetypes';
import { sounds } from '../../utils/audio';

export const LandingHeroView: React.FC = () => {
  const { setCurrentView, setActiveUpgradeModal, scanForOpportunities, opportunities } = useApp();
  const [selectedPersona, setSelectedPersona] = useState(SAMURAI_ARCHETYPES[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'personalities' | 'pricing'>('overview');
  const [showDemoVideoModal, setShowDemoVideoModal] = useState<boolean>(false);
  const [interactiveSampleIndex, setInteractiveSampleIndex] = useState<number>(0);

  const sampleOpportunities = [
    {
      author: '@alex_founder_x',
      platform: 'x',
      query: 'Looking for an AI social listening tool that doesn\'t sound like a bot and actually flags high-intent buyers on X & Reddit. Recommendations?',
      intent: 'Buying Intent (98%)',
      time: '3m ago',
      hunterReply: 'SocialSamurai cuts through the noise. It scores buying intent in real-time, matches your founder voice, and drafts non-slop replies with a single click.',
      strategistReply: 'Evaluating social listening requires two metrics: intent precision and tone fidelity. SocialSamurai applies heuristic intent filters to isolate founders with active budget.',
    },
    {
      author: 'u/growth_lead_sam',
      platform: 'reddit',
      query: 'What\'s the highest ROI organic marketing strategy for B2B SaaS right now? Cold DM response rates are in freefall.',
      intent: 'Problem Aware (94%)',
      time: '8m ago',
      hunterReply: 'High-intent Reddit & X conversation hijacking. Find founders asking for your solution 15 mins after posting and deliver an authoritative, value-first response.',
      strategistReply: 'Shifting from outbound push to context-driven inbound pull: monitor topical subreddits for specific problem statements and provide framework-level breakdowns.',
    },
  ];

  const currentSample = sampleOpportunities[interactiveSampleIndex];

  return (
    <div className="min-h-screen bg-[#08080C] text-[#F5F5F5] font-sans overflow-x-hidden selection:bg-[#9333EA] selection:text-white relative">
      {/* Dynamic Ambient Background Lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#9333EA]/15 rounded-full blur-[140px] animate-aura" />
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#7C3AED]/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#C084FC]/10 rounded-full blur-[130px]" />
        {/* Subtle Cyber Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#08080C]/80 border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <SocialSamuraiLogo size="md" onClick={() => setActiveTab('overview')} />

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#A1A1AA]">
            <a
              href="#features"
              onClick={() => setActiveTab('features')}
              className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            >
              How It Works
            </a>
            <a
              href="#personalities"
              onClick={() => setActiveTab('personalities')}
              className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            >
              Personalities
            </a>
            <a
              href="#pricing"
              onClick={() => setActiveTab('pricing')}
              className="hover:text-white transition hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
            >
              Pricing
            </a>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-white transition">
              <span>Resources</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200" />
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl p-2 hidden group-hover:block animate-in fade-in zoom-in-95">
                <button
                  onClick={() => setCurrentView('battle')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-[#9333EA]/20 flex items-center gap-2"
                >
                  <Swords className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>Shadow Fight Arcade</span>
                </button>
                <button
                  onClick={() => setCurrentView('analytics')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-white hover:bg-[#9333EA]/20 flex items-center gap-2"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>Growth Analytics</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentView('dashboard');
              }}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-[#A1A1AA] hover:text-white transition"
            >
              Log in
            </button>

            <button
              onClick={() => {
                sounds.playSwordSwish();
                setCurrentView('dashboard');
              }}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white text-sm font-bold shadow-lg shadow-[#9333EA]/30 hover:shadow-[#A855F7]/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 border border-purple-400/30"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION (EXACT REPLICA OF THE PITCH MOCKUP) */}
      <section className="relative z-10 pt-10 sm:pt-16 pb-16 lg:pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A112E]/80 border border-[#9333EA]/40 backdrop-blur-md shadow-[0_0_15px_rgba(147,51,234,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-[#C084FC] animate-pulse" />
              <span className="text-xs font-semibold tracking-wider text-[#E9D5FF] uppercase font-mono">
                AI-POWERED SOCIAL COMMAND CENTER
              </span>
            </div>

            {/* Oswald Giant Headline */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black uppercase tracking-tight text-white font-heading leading-[0.95]">
                FIND THE CONVERSATIONS{' '}
                <span className="block bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7E22CE] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.5)]">
                  WORTH JOINING.
                </span>
              </h1>
            </div>

            {/* Horizontal Line Accent */}
            <div className="w-20 h-1 bg-gradient-to-r from-[#9333EA] to-transparent rounded-full" />

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#A1A1AA] max-w-xl font-normal leading-relaxed">
              Discover relevant conversations, craft powerful replies, and grow faster on social media with AI + strategy.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  sounds.playVictory();
                  setCurrentView('dashboard');
                }}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-bold text-base shadow-xl shadow-[#9333EA]/40 hover:shadow-[#C084FC]/60 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-3 border border-purple-300/40"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setShowDemoVideoModal(true);
                }}
                className="px-6 py-4 rounded-2xl bg-[#12121A]/80 hover:bg-[#1A1A26] border border-white/10 hover:border-purple-500/40 text-white font-semibold text-base backdrop-blur-md transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-[#9333EA] flex items-center justify-center transition-colors">
                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Glass Stats Row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 max-w-lg">
              <div className="bg-[#12121A]/70 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md hover:border-purple-500/30 transition">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#C084FC]" />
                  <span className="text-xl sm:text-2xl font-black font-heading text-white">10K+</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-medium">Active Users</p>
              </div>

              <div className="bg-[#12121A]/70 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md hover:border-purple-500/30 transition">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-[#C084FC]" />
                  <span className="text-xl sm:text-2xl font-black font-heading text-white">2M+</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-medium">Conversations Found</p>
              </div>

              <div className="bg-[#12121A]/70 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-md hover:border-purple-500/30 transition">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-[#C084FC]" />
                  <span className="text-xl sm:text-2xl font-black font-heading text-white">98%</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-medium">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic + Japanese Kanji + Swirling Purple Aura */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Japanese Vertical Kanji Banner on Right Edge */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 select-none pointer-events-none z-20 opacity-85">
              <span className="text-2xl font-serif text-[#C084FC] tracking-[0.3em] [writing-mode:vertical-rl] drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] font-bold">
                会話を支配する
              </span>
              <div className="w-6 h-6 rounded-md border border-[#9333EA] flex items-center justify-center text-xs text-[#E9D5FF] font-bold bg-[#1A112E]">
                侍
              </div>
            </div>

            {/* Glowing Swirling Plasma Orbit Rings behind Samurai */}
            <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center">
              {/* Outer Swirl Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#A855F7]/30 animate-spin [animation-duration:25s]" />
              {/* Inner Glowing Plasma Arc */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#9333EA]/30 via-transparent to-[#C084FC]/30 blur-2xl animate-aura" />

              {/* Main Samurai Graphic */}
              <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.45)] group">
                <img
                  src="/hero_samurai.jpg"
                  alt="Cyber Samurai Hero"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Cyber HUD Overlay Badges */}
                <div className="absolute top-4 left-4 bg-[#08080C]/80 backdrop-blur-md border border-purple-500/40 rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-mono font-bold text-white uppercase">SAMURAI RADAR: SCANNING</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-[#08080C]/85 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#9333EA]/30 border border-[#9333EA] flex items-center justify-center text-xs">
                      ⚔️
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-heading uppercase">Current Persona</p>
                      <p className="text-[10px] text-[#C084FC]">The Hunter (High-Conviction Strikes)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playSlash();
                      setCurrentView('battle');
                    }}
                    className="px-3 py-1.5 bg-[#9333EA] hover:bg-[#A855F7] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 shadow-md shadow-[#9333EA]/40"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Battle</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRUSTED BY LOGO BAR */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-center text-xs font-bold tracking-[0.2em] text-[#A1A1AA] uppercase mb-8">
            TRUSTED BY FOUNDERS, CREATORS & MARKETERS WORLDWIDE
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all duration-300">
            {/* Loom */}
            <div className="flex items-center gap-2 text-white font-bold text-base hover:text-[#C084FC] transition">
              <span className="text-lg text-[#9333EA]">✲</span> loom
            </div>
            {/* Notion */}
            <div className="flex items-center gap-2 text-white font-bold text-base hover:text-[#C084FC] transition">
              <span className="px-1.5 py-0.5 rounded bg-white text-black font-black text-xs">N</span> Notion
            </div>
            {/* HubSpot */}
            <div className="flex items-center gap-1.5 text-white font-bold text-base hover:text-[#C084FC] transition">
              HubSp<span className="text-[#9333EA] font-black">o</span>t
            </div>
            {/* Twitter / X */}
            <div className="flex items-center gap-2 text-white font-bold text-base hover:text-[#C084FC] transition">
              twitter <span className="font-mono text-sm">𝕏</span>
            </div>
            {/* Shopify */}
            <div className="flex items-center gap-2 text-white font-bold text-base hover:text-[#C084FC] transition">
              <span className="text-[#9333EA]">🛍️</span> shopify
            </div>
            {/* Canva */}
            <div className="flex items-center gap-2 text-white font-bold text-base italic hover:text-[#C084FC] transition">
              Canva
            </div>
            {/* Webflow */}
            <div className="flex items-center gap-2 text-white font-bold text-base hover:text-[#C084FC] transition">
              <span className="font-mono text-xs">W</span> Webflow
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO: LIVE SAMURAI RADAR & REPLY STUDIO */}
      <section id="features" className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9333EA]/20 border border-[#9333EA]/40 text-xs font-semibold text-[#C084FC] uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Interactive Intelligence Scanner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-heading">
            SEE SOCIALSAMURAI IN ACTION
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA]">
            Experience how the AI detects hot discussions, identifies commercial buying intent, and crafts laser-accurate responses in seconds.
          </p>
        </div>

        {/* Live Interactive Scanner Card */}
        <div className="bg-[#0F0F17] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Sample Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#A1A1AA] uppercase">Live Feeds:</span>
              <button
                onClick={() => setInteractiveSampleIndex(0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  interactiveSampleIndex === 0
                    ? 'bg-[#9333EA] text-white shadow-md shadow-[#9333EA]/30'
                    : 'bg-[#181824] text-[#A1A1AA] hover:text-white'
                }`}
              >
                𝕏 Post (Founder Asking for Tools)
              </button>
              <button
                onClick={() => setInteractiveSampleIndex(1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  interactiveSampleIndex === 1
                    ? 'bg-[#9333EA] text-white shadow-md shadow-[#9333EA]/30'
                    : 'bg-[#181824] text-[#A1A1AA] hover:text-white'
                }`}
              >
                r/SaaS (Growth Lead Seeking Advice)
              </button>
            </div>

            <button
              onClick={() => {
                sounds.playScanBeep();
                scanForOpportunities();
              }}
              className="px-4 py-2 rounded-xl bg-[#1A112E] hover:bg-[#251842] border border-[#9333EA]/50 text-xs font-bold text-[#E9D5FF] flex items-center gap-2 transition"
            >
              <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>Run Live Global Scan</span>
            </button>
          </div>

          {/* Opportunity Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Left: Original Social Post */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Detected Lead
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                  {currentSample.intent}
                </span>
              </div>

              <div className="bg-[#14141E] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-[#C084FC]">
                      {currentSample.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{currentSample.author}</p>
                      <p className="text-[10px] text-[#A1A1AA]">{currentSample.platform.toUpperCase()} • {currentSample.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#C084FC] bg-[#9333EA]/20 px-2 py-0.5 rounded-md">
                    OPPORTUNITY SCORE 98
                  </span>
                </div>

                <p className="text-sm text-zinc-200 leading-relaxed italic">
                  "{currentSample.query}"
                </p>
              </div>

              {/* Heuristic Why Samurai Picked This */}
              <div className="bg-[#12121A] border border-purple-500/20 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-bold text-[#C084FC] uppercase flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  Why Samurai Picked This
                </p>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  High buying intent detected with urgent timeline. No corporate buzzwords or generic spam replies present. Author has high follower engagement.
                </p>
              </div>
            </div>

            {/* Right: AI Samurai Persona Replies */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Generated High-Conversion Strike
                </span>
                <span className="text-xs text-[#C084FC] font-semibold">
                  🛡️ 100% Anti-AI Slop Verified
                </span>
              </div>

              {/* Hunter Strike Card */}
              <div className="bg-[#181528] border border-[#9333EA]/40 rounded-2xl p-5 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎯</span>
                    <span className="text-xs font-bold uppercase text-white font-heading tracking-wide">
                      The Hunter Strike (Concise & Direct)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    0.4s Generation
                  </span>
                </div>
                <p className="text-sm text-zinc-100 leading-relaxed font-sans bg-[#0F0D1A] p-4 rounded-xl border border-white/5">
                  {currentSample.hunterReply}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#A1A1AA]">Tone: Razor-Sharp • Direct ROI</span>
                  <button
                    onClick={() => {
                      sounds.playVictory();
                      setCurrentView('dashboard');
                    }}
                    className="px-4 py-1.5 rounded-xl bg-[#9333EA] hover:bg-[#A855F7] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-[#9333EA]/30"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Strike</span>
                  </button>
                </div>
              </div>

              {/* Strategist Strike Card */}
              <div className="bg-[#14141F] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🧠</span>
                    <span className="text-xs font-bold uppercase text-white font-heading tracking-wide">
                      The Strategist Strike (Analytical & Structured)
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Technical Depth</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed font-sans bg-[#0A0A10] p-4 rounded-xl border border-white/5">
                  {currentSample.strategistReply}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMURAI PERSONALITIES SHOWCASE */}
      <section id="personalities" className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9333EA]/20 border border-[#9333EA]/40 text-xs font-semibold text-[#C084FC] uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Multi-Agent AI Personalities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-heading">
            MEET YOUR 6 SAMURAI ARCHETYPES
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA]">
            Each Samurai operates with distinct AI directives, custom psychological hooks, and battle-tested conversion playbooks.
          </p>
        </div>

        {/* Archetype Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {SAMURAI_ARCHETYPES.map((arch) => {
            const isSelected = selectedPersona.id === arch.id;
            return (
              <button
                key={arch.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedPersona(arch);
                }}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between min-h-[120px] ${
                  isSelected
                    ? 'bg-[#1D1236] border-[#9333EA] shadow-[0_0_20px_rgba(147,51,234,0.4)] scale-105'
                    : 'bg-[#12121A] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <span className="text-2xl mb-1 block">
                    {arch.id === 'hunter' ? '🎯' : arch.id === 'strategist' ? '♟️' : arch.id === 'creator' ? '🎨' : arch.id === 'warrior' ? '⚔️' : arch.id === 'sensei' ? '📜' : '🌙'}
                  </span>
                  <h3 className="text-sm font-bold text-white font-heading uppercase">{arch.name}</h3>
                </div>
                <p className="text-[10px] text-[#A1A1AA] line-clamp-1">{arch.aiPersonality.traits[0]}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Deep Dive Card */}
        <div className="bg-[#12121A] border border-purple-500/30 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-4">
            <div className="w-28 h-28 rounded-3xl bg-[#1A112E] border-2 border-[#9333EA] p-2 shadow-[0_0_30px_rgba(147,51,234,0.4)] flex items-center justify-center">
              <img
                src="/hero_samurai.jpg"
                alt={selectedPersona.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div>
              <h3 className="text-2xl font-black font-heading text-white uppercase">{selectedPersona.name}</h3>
              <p className="text-xs font-medium text-[#C084FC]">{selectedPersona.title}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {selectedPersona.aiPersonality.traits.map((t) => (
                <span key={t} className="px-2.5 py-0.5 rounded-full bg-[#9333EA]/20 border border-[#9333EA]/30 text-[10px] text-[#E9D5FF] font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">Playbook Directive</span>
              <p className="text-sm text-zinc-200 leading-relaxed bg-[#0A0A10] p-4 rounded-2xl border border-white/5">
                "{selectedPersona.aiPersonality.description}"
              </p>
            </div>

            {/* Combat & Gameplay Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div className="bg-[#171724] p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-[#A1A1AA] block uppercase font-semibold">Speed</span>
                <span className="text-lg font-black text-[#C084FC]">{selectedPersona.gameplayIdentity.stats.speed} / 5</span>
              </div>
              <div className="bg-[#171724] p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-[#A1A1AA] block uppercase font-semibold">Damage</span>
                <span className="text-lg font-black text-[#C084FC]">{selectedPersona.gameplayIdentity.stats.damage} / 5</span>
              </div>
              <div className="bg-[#171724] p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-[#A1A1AA] block uppercase font-semibold">Defense</span>
                <span className="text-lg font-black text-[#C084FC]">{selectedPersona.gameplayIdentity.stats.defense} / 5</span>
              </div>
              <div className="bg-[#171724] p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-[#A1A1AA] block uppercase font-semibold">Critical</span>
                <span className="text-lg font-black text-[#C084FC]">{selectedPersona.gameplayIdentity.stats.critical} / 5</span>
              </div>
              <div className="bg-[#171724] p-3 rounded-xl border border-white/5 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#A1A1AA] block uppercase font-semibold">Special Ability</span>
                <span className="text-xs font-bold text-emerald-400 block truncate">{selectedPersona.gameplayIdentity.specialAbility.split('&')[0]}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => {
                  sounds.playSwordSwish();
                  setCurrentView('battle');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#9333EA] hover:bg-[#A855F7] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-[#9333EA]/30"
              >
                <Swords className="w-4 h-4" />
                <span>Test in Shadow Arena</span>
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-[#1C1C28] hover:bg-[#252536] text-zinc-300 hover:text-white font-semibold text-xs transition"
              >
                Select for Command Center
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SHADOW FIGHT ARENA TEASER */}
      <section className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#170E2B] via-[#12121A] to-[#1F1138] border border-[#9333EA]/50 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9333EA]/30 text-xs font-bold text-[#E9D5FF] uppercase font-mono">
                ⚔️ DAILY DOJO MINI-GAME
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white font-heading leading-tight">
                SHADOW FIGHT: LAST STAND ARENA
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
                60 seconds of real-time Shadow Fight combat against AI Spambots & Slop Titans. Execute katana slashes, jump kicks, and trigger Shadow Energy bursts to earn daily credits for your AI Command Center!
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => {
                    sounds.playSlash();
                    setCurrentView('battle');
                  }}
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#9333EA]/40 flex items-center gap-3 transition transform hover:scale-105"
                >
                  <Swords className="w-5 h-5" />
                  <span>ENTER SHADOW ARENA NOW</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 rounded-3xl bg-[#08080C] border border-[#9333EA]/60 p-3 shadow-[0_0_40px_rgba(147,51,234,0.5)] flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-4xl animate-bounce">🥷</span>
                <span className="text-sm font-black font-heading uppercase text-white">UP TO 10 DAILY CREDITS</span>
                <p className="text-[10px] text-[#A1A1AA]">Practice discipline, earn AI power</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="relative z-10 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9333EA]/20 border border-[#9333EA]/40 text-xs font-semibold text-[#C084FC] uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Honest & Predictable Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-heading">
            INVEST IN YOUR DISTRIBUTION
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA]">
            Start free with daily credits, or unlock unlimited Samurai monitoring and multi-agent replies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-[#12121A] border border-white/10 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-black font-heading text-white uppercase">Free Dojo Initiate</h3>
              <p className="text-xs text-[#A1A1AA]">Great for testing social opportunity discovery.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-heading text-white">$0</span>
                <span className="text-xs text-[#A1A1AA]">/ forever</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300 pt-4 border-t border-white/10">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3 high-intent opportunities per day</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>10 daily credits via Shadow Fight arcade</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2 connected social accounts (X & Reddit)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Anti-AI slop scoring engine</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full py-3.5 rounded-2xl bg-[#1C1C28] hover:bg-[#252536] text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Get Started Free
            </button>
          </div>

          {/* Samurai Pro Tier */}
          <div className="bg-[#1D1236] border-2 border-[#9333EA] rounded-3xl p-8 space-y-6 relative flex flex-col justify-between shadow-[0_0_40px_rgba(147,51,234,0.35)]">
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#9333EA] to-[#C084FC] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
              MOST POPULAR
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black font-heading text-white uppercase flex items-center gap-2">
                <span>Samurai Master</span>
                <span className="text-sm">⚔️</span>
              </h3>
              <p className="text-xs text-[#E9D5FF]">For founders, creators, and growth operators.</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-heading text-white">$19</span>
                <span className="text-xs text-[#A1A1AA]">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-200 pt-4 border-t border-purple-500/20">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0" />
                  <strong className="text-white">Unlimited daily opportunities & scanning</strong>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0" />
                  <span>All 6 Samurai Personas & Custom Tone Tuning</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0" />
                  <span>Automated background keyword surveillance</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0" />
                  <span>1-Click Post & Reply Queuing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C084FC] shrink-0" />
                  <span>Unlimited Shadow Fight Arcade credits</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveUpgradeModal(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-black text-xs uppercase tracking-wider transition shadow-xl shadow-[#9333EA]/40"
            >
              Upgrade to Samurai Pro ($19)
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <SocialSamuraiLogo size="sm" onClick={() => setCurrentView('dashboard')} />

        <div className="text-xs text-[#A1A1AA] flex items-center gap-6">
          <button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition">Command Center</button>
          <button onClick={() => setCurrentView('battle')} className="hover:text-white transition">Shadow Arena</button>
          <button onClick={() => setCurrentView('settings')} className="hover:text-white transition">Settings</button>
        </div>

        <p className="text-xs text-[#71717A]">
          © {new Date().getFullYear()} Social Samurai. Craft with honor.
        </p>
      </footer>

      {/* DEMO VIDEO MODAL */}
      {showDemoVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#12121A] border border-[#9333EA]/50 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#C084FC]" />
                <h3 className="text-base font-bold text-white font-heading uppercase">Social Samurai 60-Second Walkthrough</h3>
              </div>
              <button
                onClick={() => setShowDemoVideoModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video bg-[#08080C] rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center p-6 space-y-4 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[#9333EA]/20 border border-[#9333EA] flex items-center justify-center text-2xl">
                ⚔️
              </div>
              <div>
                <p className="text-lg font-black font-heading text-white uppercase">Live Interactive Simulator</p>
                <p className="text-xs text-[#A1A1AA] max-w-sm mt-1">
                  Ready to test the live system? Jump into the real Command Center to trigger live scans, view AI replies, or enter the Shadow Fight Arena.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDemoVideoModal(false);
                  setCurrentView('dashboard');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#9333EA] hover:bg-[#A855F7] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#9333EA]/30 transition"
              >
                Launch Command Center Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
