import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Btn, Card, Empty, PageHeader, SectionTitle, Tag, Toggle } from '../ui';

/* Sample series — shown only when the user turns on sample data. */
const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
const REPLIES = [4, 6, 5, 9, 11, 10, 14, 17];
const BY_PLATFORM = [
  { label: 'X', value: 38 },
  { label: 'Reddit', value: 61 },
];
const TOPICS = [
  { topic: 'any recommendations', rate: 42 },
  { topic: 'alternative to', rate: 35 },
  { topic: 'reddit marketing', rate: 21 },
  { topic: 'social listening', rate: 14 },
];

const LineChart: React.FC = () => {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560, H = 220, p = { l: 30, r: 14, t: 14, b: 26 }, max = 20;
  const pts = REPLIES.map((v, i) => ({ x: p.l + (i * (W - p.l - p.r)) / (REPLIES.length - 1), y: p.t + (1 - v / max) * (H - p.t - p.b), v }));
  const line = pts.map((q, i) => `${i ? 'L' : 'M'}${q.x},${q.y}`).join(' ');
  const step = (W - p.l - p.r) / (REPLIES.length - 1);
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Replies approved per week, sample data: ${REPLIES.map((v, i) => `${WEEKS[i]} ${v}`).join(', ')}`} onMouseLeave={() => setHover(null)}>
        {[0, 10, 20].map((g) => {
          const y = p.t + (1 - g / max) * (H - p.t - p.b);
          return (
            <g key={g}>
              <line x1={p.l} x2={W - p.r} y1={y} y2={y} stroke="rgb(255 255 255 / 0.07)" />
              <text x={p.l - 8} y={y + 4} textAnchor="end" fontSize="10" fill="rgb(229 229 229 / 0.5)">{g}</text>
            </g>
          );
        })}
        {WEEKS.map((w, i) => (
          <text key={w} x={pts[i].x} y={H - 7} textAnchor="middle" fontSize="10" fill="rgb(229 229 229 / 0.5)">{w}</text>
        ))}
        <path d={`${line} L${pts.at(-1)!.x},${H - p.b} L${pts[0].x},${H - p.b} Z`} fill="rgb(139 92 246 / 0.14)" />
        <path d={line} fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        <text x={pts.at(-1)!.x - 6} y={pts.at(-1)!.y - 10} textAnchor="end" fontSize="11" fontWeight="600" fill="#fff">{REPLIES.at(-1)}</text>
        {hover !== null && (
          <g>
            <line x1={pts[hover].x} x2={pts[hover].x} y1={p.t} y2={H - p.b} stroke="rgb(255 255 255 / 0.25)" strokeDasharray="3 3" />
            <circle cx={pts[hover].x} cy={pts[hover].y} r="5" fill="#8B5CF6" stroke="#1a1a1a" strokeWidth="2" />
          </g>
        )}
        {pts.map((q, i) => (
          <rect key={i} x={q.x - step / 2} y={0} width={step} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
        ))}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-black px-2.5 py-1.5 text-[12px] ring-1 ring-white/15" style={{ left: `${(pts[hover].x / W) * 100}%`, top: `${(pts[hover].y / H) * 100}%`, marginTop: -10 }}>
          <span className="text-steel/60">{WEEKS[hover]}</span> <span className="font-semibold text-paper">{REPLIES[hover]} replies</span>
        </div>
      )}
    </div>
  );
};

const Bars: React.FC = () => {
  const max = Math.max(...BY_PLATFORM.map((b) => b.value));
  return (
    <ul className="space-y-4" aria-label="Conversations found by platform, sample data">
      {BY_PLATFORM.map((b) => (
        <li key={b.label} className="grid grid-cols-[4.5rem_1fr_2.5rem] items-center gap-3 text-[13.5px]" title={`${b.label}: ${b.value}`}>
          <span className="text-steel/75">{b.label}</span>
          <span className="h-3 overflow-hidden rounded-[4px] bg-white/[0.06]">
            <span className="block h-full rounded-[4px] bg-samurai" style={{ width: `${(b.value / max) * 100}%` }} />
          </span>
          <span className="text-right tabular-nums text-paper">{b.value}</span>
        </li>
      ))}
    </ul>
  );
};

export const Analytics: React.FC = () => {
  const { drafts, scheduled, anyConnected, setCurrentView } = useApp();
  const [sample, setSample] = useState(false);
  const session = [
    { label: 'Replies approved', value: drafts.filter((d) => d.status === 'approved').length },
    { label: 'Drafts waiting', value: drafts.filter((d) => d.status === 'awaiting').length },
    { label: 'Posts scheduled', value: scheduled.filter((s) => s.status === 'scheduled').length },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        lead="See what you published, what earned a response, and where your audience is most active."
        actions={
          <label className="inline-flex items-center gap-3 text-[13.5px] text-steel/80">
            Show sample data
            <Toggle checked={sample} onChange={() => setSample((v) => !v)} label="Show sample data" />
          </label>
        }
      />

      <ul className="mb-6 grid grid-cols-3 gap-3">
        {session.map((s) => (
          <li key={s.label} className="rounded-2xl bg-charcoal p-5 ring-1 ring-white/[0.06]">
            <p className="text-[13px] text-steel/70">{s.label}</p>
            <p className="si-d mt-3 text-[30px] tabular-nums text-paper">{s.value}</p>
            <p className="mt-1 text-[12px] text-steel/55">This session</p>
          </li>
        ))}
      </ul>

      {!sample ? (
        <Empty
          title={anyConnected ? 'Waiting for your first published reply' : 'No performance data yet'}
          body="Engagement, impressions and follower growth appear once you publish through a connected account. Turn on sample data to see what this page will look like."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Btn variant="secondary" onClick={() => setSample(true)}>
                Show sample data
              </Btn>
              {!anyConnected && (
                <Btn variant="ghost" onClick={() => setCurrentView('connections')}>
                  Connections
                </Btn>
              )}
            </div>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Card>
              <SectionTitle action={<Tag tone="muted">Sample</Tag>}>Replies approved per week</SectionTitle>
              <LineChart />
            </Card>
            <Card>
              <SectionTitle action={<Tag tone="muted">Sample</Tag>}>Conversations found, by platform</SectionTitle>
              <Bars />
              <p className="mt-5 text-[13px] leading-relaxed text-steel/65">Last 8 weeks. Reddit surfaces more recommendation requests for this keyword set.</p>
            </Card>
          </div>
          <Card>
            <SectionTitle action={<Tag tone="muted">Sample</Tag>}>Topics where replies got a response</SectionTitle>
            <table className="w-full text-left text-[14px]">
              <caption className="sr-only">Response rate by topic, sample data</caption>
              <thead>
                <tr className="border-b border-white/[0.07] text-[12.5px] text-steel/60">
                  <th scope="col" className="pb-2 font-medium">Topic</th>
                  <th scope="col" className="pb-2 text-right font-medium">Response rate</th>
                </tr>
              </thead>
              <tbody>
                {TOPICS.map((t) => (
                  <tr key={t.topic} className="border-b border-white/[0.05]">
                    <th scope="row" className="py-3 font-normal text-paper/90">“{t.topic}”</th>
                    <td className="py-3 text-right tabular-nums text-paper">{t.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
};
