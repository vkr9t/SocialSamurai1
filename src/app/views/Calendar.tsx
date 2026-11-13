import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { ScheduledPost } from '../../types';
import { Dialog } from '../Shell';
import { Btn, Card, PageHeader, PlatformBadge, Tag, cx } from '../ui';
import { fmtWhen } from './Overview';

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const Calendar: React.FC = () => {
  const { scheduled, removePost, setCurrentView } = useApp();
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState<ScheduledPost | null>(null);
  const start = startOfDay(new Date());
  start.setDate(start.getDate() + offset * 7);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const today = startOfDay(new Date()).getTime();
  const drafts = scheduled.filter((s) => s.status === 'draft');
  const label = `${days[0].toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} – ${days[6].toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`;

  return (
    <div>
      <PageHeader
        title="Calendar"
        lead="Scheduled posts for X and Reddit. Scheduling is simulated in the preview."
        actions={
          <Btn variant="primary" onClick={() => setCurrentView('create')}>
            <Plus className="h-4 w-4" aria-hidden="true" /> New post
          </Btn>
        }
      />
      <div className="mb-4 flex items-center gap-2">
        <Btn size="sm" variant="secondary" aria-label="Previous week" onClick={() => setOffset((o) => o - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </Btn>
        <Btn size="sm" variant="secondary" aria-label="Next week" onClick={() => setOffset((o) => o + 1)}>
          <ChevronRight className="h-4 w-4" />
        </Btn>
        <p className="ml-2 text-[14px] font-medium text-paper">{label}</p>
        {offset !== 0 && (
          <Btn size="sm" variant="ghost" onClick={() => setOffset(0)}>
            This week
          </Btn>
        )}
      </div>

      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
        {days.map((d) => {
          const posts = scheduled.filter((s) => s.status === 'scheduled' && startOfDay(new Date(s.when)).getTime() === d.getTime());
          const isToday = d.getTime() === today;
          return (
            <li key={d.toISOString()} className={cx('min-h-[160px] rounded-2xl p-3 ring-1', isToday ? 'bg-charcoal ring-samurai/40' : 'ring-white/[0.06]')}>
              <p className={cx('text-[12.5px]', isToday ? 'text-paper' : 'text-steel/60')}>
                {d.toLocaleDateString(undefined, { weekday: 'short' })} <span className="tabular-nums">{d.getDate()}</span>
                {isToday && <span className="ml-1.5 text-[#c4b0fb]">· Today</span>}
              </p>
              <ul className="mt-3 space-y-2">
                {posts.map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => setOpen(p)} className="w-full rounded-xl bg-white/[0.05] p-2.5 text-left hover:bg-white/[0.09]">
                      <span className="flex items-center gap-1.5 text-[11.5px] text-steel/65">
                        <PlatformBadge platform={p.platform} />
                        {new Date(p.when).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      </span>
                      <span className="mt-1.5 block text-[12.5px] leading-snug text-paper/90 line-clamp-3">{p.content}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>

      <Card className="mt-6">
        <h2 className="mb-4 text-[15px] font-semibold text-paper">Unscheduled drafts</h2>
        {drafts.length === 0 ? (
          <p className="text-[14px] text-steel/65">No drafts. Posts saved as drafts from Create land here.</p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {drafts.map((p) => (
              <li key={p.id} className="flex items-start gap-3 py-3">
                <PlatformBadge platform={p.platform} />
                <p className="flex-1 whitespace-pre-line text-[13.5px] leading-relaxed text-paper/90 line-clamp-3">{p.content}</p>
                <Btn size="sm" variant="ghost" aria-label="Delete draft" onClick={() => removePost(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Btn>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog open={!!open} onClose={() => setOpen(null)} title="Scheduled post">
        {open && (
          <>
            <div className="flex items-center gap-2">
              <PlatformBadge platform={open.platform} withLabel />
              <Tag tone="plain">{fmtWhen(open.when)}</Tag>
            </div>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-paper">{open.content}</p>
            <div className="mt-6 flex justify-end gap-2">
              <Btn
                variant="secondary"
                onClick={() => {
                  removePost(open.id);
                  setOpen(null);
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
              </Btn>
              <Btn variant="primary" onClick={() => setOpen(null)}>
                Done
              </Btn>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
};
