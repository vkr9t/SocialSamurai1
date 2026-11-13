import React, { useEffect, useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, RotateCcw, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Opportunity, PlatformType } from '../../types';
import { Btn, Card, Empty, PageHeader, PlatformBadge, ScoreDial, Tag, cx } from '../ui';

const SIGNAL_LABELS: [keyof Opportunity['signals'], string][] = [
  ['relevance', 'Keyword relevance'],
  ['intent', 'Intent'],
  ['fit', 'Audience fit'],
  ['engagement', 'Engagement'],
  ['recency', 'Recency'],
];

export const Signals: React.FC<{ o: Opportunity }> = ({ o }) => (
  <dl className="space-y-2.5">
    {SIGNAL_LABELS.map(([k, label]) => (
      <div key={k} className="grid grid-cols-[8.5rem_1fr_2rem] items-center gap-3 text-[13px]">
        <dt className="text-steel/70">{label}</dt>
        <dd className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-samurai" style={{ width: `${o.signals[k]}%` }} />
        </dd>
        <dd className="text-right tabular-nums text-paper/85">{o.signals[k]}</dd>
      </div>
    ))}
  </dl>
);

const statusTag = (s: Opportunity['status']) =>
  s === 'approved' ? <Tag tone="ok">Approved</Tag> : s === 'drafted' ? <Tag tone="plain">Draft saved</Tag> : s === 'saved' ? <Tag tone="muted">Saved</Tag> : null;

type Filter = 'all' | PlatformType;

export const Opportunities: React.FC = () => {
  const { opportunities, setOpportunityStatus, openStudio, refreshOpportunities, keywords } = useApp();
  const [platform, setPlatform] = useState<Filter>('all');
  const [showHandled, setShowHandled] = useState(false);
  const list = useMemo(
    () =>
      opportunities
        .filter((o) => o.status !== 'dismissed')
        .filter((o) => (showHandled ? true : o.status !== 'approved'))
        .filter((o) => platform === 'all' || o.platform === platform)
        .sort((a, b) => b.score - a.score),
    [opportunities, platform, showHandled]
  );
  const [selected, setSelected] = useState<string | null>(list[0]?.id ?? null);
  useEffect(() => {
    if (!list.find((o) => o.id === selected)) setSelected(list[0]?.id ?? null);
  }, [list, selected]);
  const current = list.find((o) => o.id === selected);
  const dismissedCount = opportunities.filter((o) => o.status === 'dismissed').length;

  return (
    <div>
      <PageHeader
        title="Opportunities"
        lead={
          <>
            Conversations matching your keywords, ranked by how worth joining they are. Tracking{' '}
            <span className="text-paper">{keywords.length} keywords</span>. Sample data in the preview.
          </>
        }
        actions={
          dismissedCount > 0 && (
            <Btn variant="secondary" onClick={refreshOpportunities}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Restore {dismissedCount} dismissed
            </Btn>
          )
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label="Platform" className="inline-flex rounded-full p-1 ring-1 ring-white/12">
          {(['all', 'x', 'reddit'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={platform === f}
              onClick={() => setPlatform(f)}
              className={cx('h-8 rounded-full px-4 text-[13px] transition-colors', platform === f ? 'bg-white text-black' : 'text-steel/75 hover:text-paper')}
            >
              {f === 'all' ? 'All' : f === 'x' ? 'X' : 'Reddit'}
            </button>
          ))}
        </div>
        <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-[13px] text-steel/75">
          <input type="checkbox" checked={showHandled} onChange={(e) => setShowHandled(e.target.checked)} className="h-4 w-4 accent-[#8B5CF6]" />
          Show approved
        </label>
      </div>

      {list.length === 0 ? (
        <Empty
          title="You’re all caught up"
          body="Every conversation has been handled or dismissed. Restore dismissed ones, or add keywords in Settings to widen the search."
          action={
            <Btn variant="secondary" onClick={refreshOpportunities}>
              Restore sample feed
            </Btn>
          }
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <ul className="space-y-2" aria-label="Opportunities">
            {list.map((o) => {
              const on = o.id === current?.id;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelected(o.id)}
                    className={cx(
                      'flex w-full gap-4 rounded-2xl p-4 text-left ring-1 transition-colors',
                      on ? 'bg-charcoal ring-samurai/50' : 'ring-white/[0.06] hover:bg-white/[0.03]'
                    )}
                  >
                    <ScoreDial score={o.score} />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-[12.5px] text-steel/65">
                        <PlatformBadge platform={o.platform} />
                        {o.community ?? o.handle} · {o.age} ago {statusTag(o.status)}
                      </span>
                      <span className="mt-1.5 block text-[14px] leading-relaxed text-paper/90 line-clamp-2">{o.text}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {current && (
            <Card className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex flex-wrap items-center gap-2 text-[13px] text-steel/70">
                <PlatformBadge platform={current.platform} withLabel />
                <span>
                  {current.author} · {current.community ? `${current.community} · ` : ''}
                  {current.age} ago
                </span>
              </div>
              <p className="mt-4 text-[16px] leading-relaxed text-paper">{current.text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag tone="violet">{current.intent}</Tag>
                <Tag tone="muted">matched “{current.topic}”</Tag>
              </div>

              <div className="mt-6 grid gap-6 border-t border-white/[0.07] pt-6 sm:grid-cols-[auto_1fr] sm:items-start">
                <div className="flex flex-col items-center">
                  <ScoreDial score={current.score} size={72} />
                  <p className="mt-2 text-[12px] text-steel/60">Opportunity score</p>
                </div>
                <Signals o={current} />
              </div>

              <div className="mt-6 rounded-2xl bg-black/40 p-4">
                <p className="text-[13px] font-medium text-paper">Why this was picked</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-steel/75">{current.why}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Btn variant="primary" onClick={() => openStudio(current.id)}>
                  {current.status === 'drafted' || current.status === 'approved' ? 'Open draft' : 'Draft a reply'}
                </Btn>
                <Btn
                  variant="secondary"
                  onClick={() => setOpportunityStatus(current.id, current.status === 'saved' ? 'new' : 'saved')}
                  disabled={current.status === 'drafted' || current.status === 'approved'}
                >
                  {current.status === 'saved' ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
                  {current.status === 'saved' ? 'Saved' : 'Save'}
                </Btn>
                <Btn variant="ghost" onClick={() => setOpportunityStatus(current.id, 'dismissed')}>
                  <X className="h-4 w-4" aria-hidden="true" /> Not relevant
                </Btn>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
