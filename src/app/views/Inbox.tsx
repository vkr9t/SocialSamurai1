import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Btn, Card, Empty, Initials, PageHeader, PlatformBadge, Tag, cx, inputCls } from '../ui';

const KIND = { mention: 'Mention', reply: 'Reply', question: 'Question' } as const;

export const Inbox: React.FC = () => {
  const { inbox, markRead, toast } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const list = inbox.filter((i) => (filter === 'unread' ? !i.read : true));
  const [selected, setSelected] = useState<string | null>(list[0]?.id ?? null);
  const current = inbox.find((i) => i.id === selected);
  const [reply, setReply] = useState(current?.suggestedReply ?? '');
  useEffect(() => setReply(current?.suggestedReply ?? ''), [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      toast('Reply copied');
    } catch {
      toast('Couldn’t copy — select the text instead');
    }
  };

  return (
    <div>
      <PageHeader title="Inbox" lead="Mentions and replies to your posts, with a suggested response for each. Sample messages in the preview." />
      <div role="tablist" aria-label="Filter" className="mb-5 inline-flex rounded-full p-1 ring-1 ring-white/12">
        {(['all', 'unread'] as const).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cx('h-8 rounded-full px-4 text-[13px]', filter === f ? 'bg-white text-black' : 'text-steel/75 hover:text-paper')}
          >
            {f === 'all' ? 'All' : `Unread · ${inbox.filter((i) => !i.read).length}`}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Empty title="Inbox zero" body="No unread messages. New mentions and replies will show up here once accounts are connected." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <ul className="space-y-2">
            {list.map((i) => (
              <li key={i.id}>
                <button
                  type="button"
                  aria-pressed={i.id === selected}
                  onClick={() => {
                    setSelected(i.id);
                    markRead(i.id);
                  }}
                  className={cx('flex w-full gap-3 rounded-2xl p-4 text-left ring-1 transition-colors', i.id === selected ? 'bg-charcoal ring-samurai/50' : 'ring-white/[0.06] hover:bg-white/[0.03]')}
                >
                  <Initials name={i.author} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-[13px]">
                      <span className={cx('font-medium', i.read ? 'text-steel/80' : 'text-paper')}>{i.author}</span>
                      <span className="text-steel/55">{i.age} ago</span>
                      {!i.read && <span className="ml-auto h-2 w-2 rounded-full bg-samurai" aria-label="Unread" />}
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-steel/75 line-clamp-2">{i.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {current && (
            <Card className="lg:sticky lg:top-24 lg:self-start">
              <div className="flex flex-wrap items-center gap-2 text-[13px] text-steel/70">
                <PlatformBadge platform={current.platform} withLabel />
                <span>
                  {current.author} · {current.handle}
                </span>
                <Tag tone="plain">{KIND[current.kind]}</Tag>
              </div>
              <p className="mt-4 text-[16px] leading-relaxed text-paper">{current.text}</p>
              <p className="mt-4 text-[13.5px] text-steel/65">Summary: {current.summary}</p>
              <label htmlFor="inbox-reply" className="mt-6 mb-2 block text-[13px] font-medium text-steel/85">
                Suggested reply
              </label>
              <textarea id="inbox-reply" rows={5} value={reply} onChange={(e) => setReply(e.target.value)} className={cx(inputCls, 'resize-y leading-relaxed')} />
              <div className="mt-4 flex flex-wrap gap-2">
                <Btn variant="primary" onClick={copy} disabled={!reply.trim()}>
                  <Copy className="h-4 w-4" aria-hidden="true" /> Copy reply
                </Btn>
              </div>
              <p className="mt-3 text-[12.5px] text-steel/60">Sending replies directly arrives with live X and Reddit connections.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
