import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Btn, Card, Empty, PageHeader, PlatformBadge, Tag, cx } from '../ui';

export const Drafts: React.FC = () => {
  const { drafts, opportunities, openStudio, setCurrentView } = useApp();
  const [tab, setTab] = useState<'awaiting' | 'approved'>('awaiting');
  const list = drafts.filter((d) => d.status === tab);
  const counts = { awaiting: drafts.filter((d) => d.status === 'awaiting').length, approved: drafts.filter((d) => d.status === 'approved').length };

  return (
    <div>
      <PageHeader title="Drafts" lead="Replies you’ve started. Nothing leaves SocialSamurai until you approve it." />
      <div role="tablist" aria-label="Draft status" className="mb-5 inline-flex rounded-full p-1 ring-1 ring-white/12">
        {(['awaiting', 'approved'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cx('h-8 rounded-full px-4 text-[13px] transition-colors', tab === t ? 'bg-white text-black' : 'text-steel/75 hover:text-paper')}
          >
            {t === 'awaiting' ? 'Awaiting approval' : 'Approved'} · {counts[t]}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty
          title={tab === 'awaiting' ? 'No drafts waiting' : 'Nothing approved yet'}
          body={tab === 'awaiting' ? 'Open an opportunity and draft a reply. Saved drafts appear here for review.' : 'Approved replies appear here. In the preview, nothing is actually posted.'}
          action={
            <Btn variant="secondary" onClick={() => setCurrentView('opportunities')}>
              Go to opportunities
            </Btn>
          }
        />
      ) : (
        <ul className="space-y-3">
          {list.map((d) => {
            const o = opportunities.find((x) => x.id === d.opportunityId);
            if (!o) return null;
            return (
              <li key={d.id}>
                <Card className="grid gap-4 md:grid-cols-[1fr_1.2fr_auto] md:items-start">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[12.5px] text-steel/65">
                      <PlatformBadge platform={o.platform} /> {o.community ?? o.handle}
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-steel/70 line-clamp-3">{o.text}</p>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Tag tone="plain">{d.tone}</Tag>
                      <span className="text-[12px] text-steel/55">Updated {d.updatedAt}</span>
                    </div>
                    <p className="mt-2 text-[14px] leading-relaxed text-paper/90">{d.text}</p>
                  </div>
                  <Btn size="sm" variant={tab === 'awaiting' ? 'primary' : 'secondary'} onClick={() => openStudio(o.id)}>
                    {tab === 'awaiting' ? 'Review' : 'Open'}
                  </Btn>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
