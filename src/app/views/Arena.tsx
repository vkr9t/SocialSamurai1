import React, { useEffect, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShadowFightGame } from '../../components/Battle/ShadowFightGame';
import { Btn, Card, PageHeader, Tag } from '../ui';

type Phase = 'lobby' | 'countdown' | 'playing' | 'results';

export const Arena: React.FC = () => {
  const { credits, creditsMax, earnCredits, setCurrentView } = useApp();
  const [phase, setPhase] = useState<Phase>('lobby');
  const [count, setCount] = useState(3);
  const [result, setResult] = useState<{ score: number; earned: number; victory: boolean } | null>(null);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count === 0) {
      setPhase('playing');
      return;
    }
    const t = window.setTimeout(() => setCount((c) => c - 1), 700);
    return () => window.clearTimeout(t);
  }, [phase, count]);

  const start = () => {
    setCount(3);
    setPhase('countdown');
  };

  return (
    <div>
      <PageHeader
        title="Arena"
        lead="A 60-second challenge that rewards showing up every day. Earn credits for AI actions."
        actions={<Tag tone="muted">Early prototype</Tag>}
      />

      {phase === 'lobby' && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="relative overflow-hidden">
            <p aria-hidden="true" className="si-d si-outline pointer-events-none absolute -right-4 -top-10 select-none text-[13rem] leading-none opacity-60">
              60
            </p>
            <div className="relative">
              <h2 className="si-d-med text-[24px] text-paper">How a round works</h2>
              <ul className="mt-5 space-y-3 text-[14.5px] leading-relaxed text-steel/80">
                <li>Survive 60 seconds against waves of spam bots.</li>
                <li>Move with A / D or the arrow keys and jump with W or Space. Attack with J, heavy attack with K, kick with L.</li>
                <li>A higher score earns more credits, up to today’s limit.</li>
              </ul>
              <Btn variant="primary" className="mt-7" onClick={start} disabled={credits >= creditsMax}>
                Start round <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Btn>
              {credits >= creditsMax && <p className="mt-3 text-[13px] text-steel/65">You’ve earned today’s maximum. Come back tomorrow.</p>}
            </div>
          </Card>
          <Card>
            <p className="text-[13px] text-steel/70">Credits today</p>
            <p className="si-d mt-3 text-[40px] tabular-nums text-paper">
              {credits}
              <span className="text-[22px] text-steel/50"> / {creditsMax}</span>
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-samurai" style={{ width: `${(credits / creditsMax) * 100}%` }} />
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-steel/65">
              Credits are a preview of how AI usage will be measured. Rules and rewards may change before launch.
            </p>
          </Card>
        </div>
      )}

      {phase === 'countdown' && (
        <Card className="flex min-h-[420px] flex-col items-center justify-center" aria-live="assertive">
          <p className="text-[14px] text-steel/70">Get ready</p>
          <p className="si-d mt-2 text-[8rem] leading-none text-paper">{count || 'Go'}</p>
        </Card>
      )}

      {phase === 'playing' && (
        <div className="overflow-hidden rounded-3xl ring-1 ring-white/10">
          <ShadowFightGame
            onGameOver={(score, _combo, _kills, victory) => {
              const earned = earnCredits(score);
              setResult({ score, earned, victory });
              setPhase('results');
            }}
          />
        </div>
      )}

      {phase === 'results' && result && (
        <Card className="mx-auto max-w-lg text-center">
          <p className="text-[14px] text-steel/70">{result.victory ? 'Round complete' : 'Round over'}</p>
          <p className="si-d mt-3 text-[56px] tabular-nums text-paper">{result.score}</p>
          <p className="text-[13px] text-steel/60">points</p>
          <p className="mt-6 text-[15px] text-paper">{result.earned > 0 ? `+${result.earned} credits earned` : 'Daily credit limit reached'}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Btn variant="primary" onClick={start} disabled={credits >= creditsMax}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Play again
            </Btn>
            <Btn variant="secondary" onClick={() => setCurrentView('dashboard')}>
              Back to overview
            </Btn>
          </div>
        </Card>
      )}
    </div>
  );
};
