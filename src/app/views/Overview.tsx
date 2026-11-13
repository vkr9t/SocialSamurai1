import React from 'react';
import { ArrowRight, Plug, Swords } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Btn, Card, PlatformBadge, ScoreDial, SectionTitle, Tag } from '../ui';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

export const fmtWhen = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

export const Overview: React.FC = () => {
  const { profile, opportunities, drafts, scheduled, credits, creditsMax, anyConnected, setCurrentView, openStudio } = useApp();
  const open = opportunities.filter((o) => o.status === 'new' || o.status === 'saved').sort((a, b) => b.score - a.score);
  const awaiting = drafts.filter((d) => d.status === 'awaiting');
  const approved = drafts.filter((d) => d.status === 'approved');
  const upcoming = scheduled.filter((s) => s.status === 'scheduled' && new Date(s.when) > new Date());

  const stats = [
    { label: 'Open opportunities', value: open.length, note: 'Ready to review', go: 'opportunities' as const },
    { label: 'Drafts to approve', value: awaiting.length, note: awaiting.length ? 'Waiting for you' : 'Nothing waiting', go: 'drafts' as const },
    { label: 'Approved replies', value: approved.length, note: 'This session', go: 'drafts' as const },
    { label: 'Scheduled posts', value: upcoming.length, note: upcoming[0] ? `Next: ${fmtWhen(upcoming[0].when)}` : 'None scheduled', go: 'calendar' as const },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-black p-6 ring-1 ring-white/[0.08] sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgb(91_33_182/0.5),transparent)] blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="si-jp text-[15px] text-samurai" lang="ja">
              会話を支配する
            </p>
            <h1 className="si-d mt-3 text-[clamp(1.9rem,1.4rem+2vw,3rem)] text-paper">
              {greeting()}, {profile.name}.
            </h1>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-steel/75">
              {open.length
                ? `${open.length} sample conversation${open.length === 1 ? '' : 's'} worth a look. Start with the highest score.`
                : 'You’re through every opportunity. Refresh the sample feed or create a post.'}
            </p>
          </div>
          <Btn variant="primary" onClick={() => setCurrentView('opportunities')}>
            Review opportunities <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Btn>
        </div>
      </section>

      {!anyConnected && (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
              <Plug className="h-[18px] w-[18px] text-paper" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[14.5px] font-medium text-paper">No accounts connected</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-steel/70">
                Live X and Reddit connections are in development. You can simulate one to explore the full workflow.
              </p>
            </div>
          </div>
          <Btn variant="secondary" onClick={() => setCurrentView('connections')}>
            Open connections
          </Btn>
        </Card>
      )}

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <button
              type="button"
              onClick={() => setCurrentView(s.go)}
              className="h-full w-full rounded-2xl bg-charcoal p-5 text-left ring-1 ring-white/[0.06] transition-colors hover:ring-white/20"
            >
              <p className="text-[13px] text-steel/70">{s.label}</p>
              <p className="si-d mt-3 text-[34px] tabular-nums text-paper">{s.value}</p>
              <p className="mt-1 truncate text-[12.5px] text-steel/60">{s.note}</p>
            </button>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <SectionTitle
            action={
              <Btn size="sm" variant="ghost" onClick={() => setCurrentView('opportunities')}>
                View all
              </Btn>
            }
          >
            Top opportunities
          </SectionTitle>
          {open.length === 0 ? (
            <p className="text-[14px] text-steel/65">No open opportunities.</p>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {open.slice(0, 3).map((o) => (
                <li key={o.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-4">
                    <ScoreDial score={o.score} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-steel/65">
                        <PlatformBadge platform={o.platform} />
                        <span>{o.community ?? o.handle}</span>
                        <span aria-hidden="true">·</span>
                        <span>{o.age} ago</span>
                        <Tag tone="violet">{o.intent}</Tag>
                      </div>
                      <p className="mt-2 text-[14px] leading-relaxed text-paper/90 line-clamp-2">{o.text}</p>
                    </div>
                    <div className="hidden sm:block">
                      <Btn size="sm" variant="secondary" onClick={() => openStudio(o.id)}>
                        Draft reply
                      </Btn>
                    </div>
                  </div>
                  <div className="mt-3 pl-[3.75rem] sm:hidden">
                    <Btn size="sm" variant="secondary" onClick={() => openStudio(o.id)}>
                      Draft reply
                    </Btn>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle
              action={
                <Btn size="sm" variant="ghost" onClick={() => setCurrentView('calendar')}>
                  Calendar
                </Btn>
              }
            >
              Coming up
            </SectionTitle>
            {upcoming.length === 0 ? (
              <p className="text-[14px] text-steel/65">Nothing scheduled.</p>
            ) : (
              <ul className="space-y-4">
                {upcoming.slice(0, 3).map((s) => (
                  <li key={s.id} className="flex gap-3">
                    <PlatformBadge platform={s.platform} />
                    <div className="min-w-0">
                      <p className="text-[12.5px] text-steel/60">{fmtWhen(s.when)}</p>
                      <p className="mt-0.5 text-[13.5px] leading-relaxed text-paper/90 line-clamp-2">{s.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-deep/40 ring-1 ring-samurai/40">
              <Swords className="h-5 w-5 text-paper" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-medium text-paper">Arena</p>
              <p className="text-[13px] text-steel/65">
                {credits < creditsMax ? `${creditsMax - credits} credits left to earn today` : 'Daily credits maxed out'}
              </p>
            </div>
            <Btn size="sm" variant="secondary" onClick={() => setCurrentView('battle')}>
              Play
            </Btn>
          </Card>
        </div>
      </div>
    </div>
  );
};
