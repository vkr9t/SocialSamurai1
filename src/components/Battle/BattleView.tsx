import React, { useState } from 'react';
import { Swords, Trophy, Sparkles, Flame, Shield, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShadowFightGame } from './ShadowFightGame';
import { sounds } from '../../utils/audio';

export const BattleView: React.FC = () => {
  const { earnGameCredits, usageLimits, setCurrentView } = useApp();

  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'playing' | 'results'>('lobby');
  const [countdown, setCountdown] = useState<number>(3);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'normal' | 'hard' | 'nightmare'>('normal');
  const [lastResults, setLastResults] = useState<{
    score: number;
    combo: number;
    enemiesKilled: number;
    victory: boolean;
    creditsAwarded: number;
  }>({ score: 0, combo: 0, enemiesKilled: 0, victory: true, creditsAwarded: 0 });

  const startCountdown = () => {
    sounds.playScanBeep();
    setGameState('countdown');
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setGameState('playing');
          return 0;
        }
        return prev - 1;
      });
    }, 700);
  };

  const handleGameOver = (
    finalScore: number,
    combo: number,
    enemiesKilled: number,
    victory: boolean
  ) => {
    const credits = earnGameCredits(finalScore);
    setLastResults({
      score: finalScore,
      combo,
      enemiesKilled,
      victory,
      creditsAwarded: credits,
    });
    setGameState('results');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 select-none">
      {/* Header Banner */}
      <div className="bg-[#12121A] border border-[#9333EA]/40 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#C084FC] uppercase tracking-wider">
                SHADOW FIGHT 2D ARENA
              </span>
              <span className="text-[10px] bg-[#9333EA]/20 text-[#E9D5FF] border border-[#9333EA]/40 px-2.5 py-0.5 rounded-full font-bold">
                DAILY RETENTION DOJO
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-wide uppercase mt-1">
              SHADOW FIGHT: LAST STAND ⚔️
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              60 seconds of fluid silhouette combat. Execute Katana combos & Dimension Slices to earn Samurai Command Center Credits.
            </p>
          </div>

          {/* Daily credit cap widget */}
          <div className="bg-[#181528] border border-[#9333EA]/50 px-5 py-3 rounded-2xl text-center shrink-0 shadow-lg shadow-[#9333EA]/20">
            <span className="text-[10px] text-[#C084FC] uppercase font-bold tracking-wider block">
              DAILY CREDIT REWARD
            </span>
            <span className="text-lg font-black text-white font-heading">
              {usageLimits.dailyCreditsCount} / {usageLimits.dailyCreditsMax} CREDITS
            </span>
          </div>
        </div>
      </div>

      {/* LOBBY STATE */}
      {gameState === 'lobby' && (
        <div className="bg-[#12121A] border border-white/10 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl space-y-8">
          {/* Visual Dojo Banner */}
          <div className="max-w-md mx-auto relative group">
            <div className="w-32 h-32 mx-auto rounded-3xl bg-[#1A112E] border-2 border-[#9333EA] p-3 shadow-[0_0_35px_rgba(147,51,234,0.5)] flex items-center justify-center">
              <img
                src="/hero_samurai.jpg"
                alt="Samurai Fighter"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="mt-3">
              <h2 className="text-xl font-black font-heading uppercase text-white">CHOOSE YOUR CHALLENGE</h2>
              <p className="text-xs text-[#C084FC]">Defeat 3 Waves: Shadow Shinobi, Slop Titan & Eclipse Ronin</p>
            </div>
          </div>

          {/* Bosses Lineup Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="bg-[#0A0A10] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase">WAVE 1</span>
                <span className="text-[10px] text-zinc-400">Agile</span>
              </div>
              <h3 className="text-sm font-black font-heading text-white uppercase">Shadow Shinobi</h3>
              <p className="text-[11px] text-[#A1A1AA]">Rapid dual daggers & kunai projectiles.</p>
            </div>

            <div className="bg-[#0A0A10] border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase">WAVE 2</span>
                <span className="text-[10px] text-zinc-400">Heavy</span>
              </div>
              <h3 className="text-sm font-black font-heading text-white uppercase">Titan of Slop</h3>
              <p className="text-[11px] text-[#A1A1AA]">Massive war club & ground shockwaves.</p>
            </div>

            <div className="bg-[#0A0A10] border border-[#9333EA]/40 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#C084FC] uppercase">BOSS</span>
                <span className="text-[10px] text-purple-300">Master</span>
              </div>
              <h3 className="text-sm font-black font-heading text-white uppercase">Eclipse Ronin</h3>
              <p className="text-[11px] text-[#A1A1AA]">Counter-parries & shadow dimension slice.</p>
            </div>
          </div>

          {/* Key Controls Cheat Sheet */}
          <div className="bg-[#08080C] border border-white/5 rounded-2xl p-4 max-w-xl mx-auto flex flex-wrap items-center justify-around gap-3 text-xs text-[#A1A1AA]">
            <span><strong className="text-white">A / D:</strong> Move</span>
            <span><strong className="text-white">SPACE:</strong> Jump</span>
            <span><strong className="text-white">J:</strong> Slash Combo</span>
            <span><strong className="text-white">K:</strong> Heavy Thrust</span>
            <span><strong className="text-white">I:</strong> Kunai</span>
            <span><strong className="text-[#C084FC]">U:</strong> Dimension Slice</span>
          </div>

          <button
            onClick={startCountdown}
            className="py-4 px-12 bg-gradient-to-r from-[#9333EA] via-[#A855F7] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-[#9333EA]/50 transition transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-3 border border-purple-400/40"
          >
            <Swords className="w-5 h-5 fill-white" />
            <span>ENTER SHADOW ARENA (FIGHT)</span>
          </button>
        </div>
      )}

      {/* COUNTDOWN STATE */}
      {gameState === 'countdown' && (
        <div className="bg-[#08080C] border-2 border-[#9333EA] rounded-3xl p-16 text-center shadow-[0_0_50px_rgba(147,51,234,0.4)] flex flex-col items-center justify-center min-h-[400px]">
          <span className="text-xs font-mono font-bold text-[#C084FC] uppercase mb-4 tracking-widest">
            INITIALIZING SHADOW DOJO
          </span>
          <div className="text-8xl font-black text-white font-heading animate-ping tracking-widest drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
            {countdown}
          </div>
          <span className="text-sm font-extrabold text-[#E9D5FF] uppercase mt-6 tracking-wider font-heading">
            DRAW YOUR BLADE!
          </span>
        </div>
      )}

      {/* PLAYING STATE */}
      {gameState === 'playing' && <ShadowFightGame onGameOver={handleGameOver} />}

      {/* RESULTS STATE */}
      {gameState === 'results' && (
        <div className="bg-[#12121A] border-2 border-[#9333EA]/60 rounded-3xl p-6 sm:p-10 text-center max-w-lg mx-auto shadow-2xl animate-in zoom-in-95 space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-[#1A112E] border-2 border-[#9333EA] p-2 shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center text-4xl">
            {lastResults.victory ? '🏆' : '⚔️'}
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading tracking-tight uppercase">
              {lastResults.victory ? 'GLORIOUS VICTORY!' : 'BATTLE CONCLUDED'}
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">
              You fought with honor in Shadow Fight: Last Stand.
            </p>
          </div>

          {/* Stats breakdown */}
          <div className="grid grid-cols-2 gap-3 bg-[#08080C] border border-white/10 rounded-2xl p-4 text-left">
            <div>
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold">TOTAL SCORE</span>
              <p className="text-2xl font-black text-white font-heading">{lastResults.score.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold">MAX COMBO</span>
              <p className="text-2xl font-black text-[#C084FC] font-heading">{lastResults.combo}× STRIKE</p>
            </div>
            <div>
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold">ENEMIES DEFEATED</span>
              <p className="text-lg font-bold text-white">{lastResults.enemiesKilled} Bosses</p>
            </div>
            <div>
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold">CREDITS REWARDED</span>
              <p className="text-lg font-bold text-emerald-400">+{lastResults.creditsAwarded} Credits</p>
            </div>
          </div>

          {/* Daily reward note */}
          <div className="bg-[#181528] border border-emerald-500/40 p-3 rounded-xl text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>DAILY REWARD: {usageLimits.dailyCreditsCount} / {usageLimits.dailyCreditsMax} Credits Available</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setGameState('lobby')}
              className="flex-1 py-3 bg-[#1C1C28] hover:bg-[#252536] border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>
            <button
              onClick={() => setCurrentView('opportunities')}
              className="flex-1 py-3 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#A855F7] hover:to-[#9333EA] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-[#9333EA]/40 transition flex items-center justify-center gap-2"
            >
              <span>USE IN COMMAND CENTER 🥷</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

