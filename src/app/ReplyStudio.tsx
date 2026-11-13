import React, { useEffect, useMemo, useState } from 'react';
import { Check, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ReplyTone } from '../types';
import { PERSONALITIES } from '../components/Site/content';
import { Dialog } from './Shell';
import { Btn, PlatformBadge, Tag, cx, inputCls } from './ui';

const TONES: ReplyTone[] = ['Helpful', 'Professional', 'Technical', 'Casual', 'Concise', 'Bold'];

/** Prepared variations so regenerate visibly does something in the preview. */
const restyle = (base: string, tone: ReplyTone, n: number): string => {
  const first = base.split(/(?<=[.!?])\s+/)[0];
  const variants: Record<ReplyTone, string[]> = {
    Helpful: [base, `Had the same issue. ${base}`],
    Professional: [`A practical approach: ${base.charAt(0).toLowerCase()}${base.slice(1)}`, `In our experience, ${base.charAt(0).toLowerCase()}${base.slice(1)}`],
    Technical: [`Concretely: ${base}`, `${base} Happy to share the exact query setup.`],
    Casual: [`Honestly? ${first}`, `${first} Worked for us, anyway.`],
    Concise: [first, first.replace(/,.*$/, '.')],
    Bold: [`${first} Most people skip this.`, `Unpopular opinion: ${first.charAt(0).toLowerCase()}${first.slice(1)}`],
  };
  const list = variants[tone];
  return list[n % list.length];
};

export const ReplyStudio: React.FC = () => {
  const { studioFor, closeStudio, opportunities, drafts, saveDraft, approveDraft, discardDraft, profile, anyConnected } = useApp();
  const o = opportunities.find((x) => x.id === studioFor);
  const existing = drafts.find((d) => d.opportunityId === studioFor);
  const firstTone = useMemo<ReplyTone>(() => (o ? (Object.keys(o.drafts)[0] as ReplyTone) : 'Helpful'), [o]);
  const [tone, setTone] = useState<ReplyTone>('Helpful');
  const [text, setText] = useState('');
  const [round, setRound] = useState(0);
  const personality = PERSONALITIES.find((p) => p.key === profile.personality);

  useEffect(() => {
    if (!o) return;
    const t = existing?.tone ?? firstTone;
    setTone(t);
    setText(existing?.text ?? o.drafts[t] ?? restyle(o.drafts[firstTone] ?? '', t, 0));
    setRound(0);
  }, [studioFor]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!o) return null;

  const base = o.drafts[firstTone] ?? '';
  const pickTone = (t: ReplyTone) => {
    setTone(t);
    setRound(0);
    setText(o.drafts[t] ?? restyle(base, t, 0));
  };
  const regenerate = () => {
    const n = round + 1;
    setRound(n);
    setText(restyle(o.drafts[tone] ?? base, tone, n));
  };
  const approved = existing?.status === 'approved' && existing.text === text;
  const limit = o.platform === 'x' ? 280 : 10000;

  return (
    <Dialog open={!!studioFor} onClose={closeStudio} title="Reply Studio" wide>
      <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-steel/70">
            <PlatformBadge platform={o.platform} withLabel />
            <span>
              {o.author}
              {o.community ? ` · ${o.community}` : ''}
            </span>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-paper">{o.text}</p>
          <div className="mt-5 rounded-2xl bg-black/40 p-4">
            <p className="text-[13px] font-medium text-paper">Context used</p>
            <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-steel/70">
              <li>Intent: {o.intent.toLowerCase()}</li>
              <li>Brand voice: {profile.voice}</li>
              <li>Personality: {personality?.name ?? '—'}</li>
            </ul>
          </div>
        </div>

        <div>
          <p className="mb-2 text-[13px] font-medium text-steel/85">Tone</p>
          <div role="radiogroup" aria-label="Tone" className="flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={tone === t}
                onClick={() => pickTone(t)}
                className={cx(
                  'rounded-full px-3 py-1.5 text-[13px] ring-1 ring-inset transition-colors',
                  tone === t ? 'bg-samurai/20 text-paper ring-samurai/60' : 'text-steel/70 ring-white/12 hover:text-paper hover:ring-white/30'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <label htmlFor="studio-text" className="mt-5 mb-2 block text-[13px] font-medium text-steel/85">
            Your reply
          </label>
          <textarea id="studio-text" rows={7} value={text} onChange={(e) => setText(e.target.value)} className={cx(inputCls, 'resize-y leading-relaxed')} />
          <div className="mt-2 flex items-center justify-between text-[12.5px]">
            <button type="button" onClick={regenerate} className="inline-flex items-center gap-1.5 text-steel/75 hover:text-paper">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Regenerate
            </button>
            <span className={cx('tabular-nums', text.length > limit ? 'text-paper' : 'text-steel/55')}>
              {text.length}
              {o.platform === 'x' && ` / ${limit}`}
            </span>
          </div>
          {text.length > limit && <p className="mt-1 text-[12.5px] text-paper">Too long for X — shorten it or choose Concise.</p>}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Btn variant="primary" disabled={!text.trim() || text.length > limit || approved} onClick={() => approveDraft(o.id, tone, text)}>
              <Check className="h-4 w-4" aria-hidden="true" /> {approved ? 'Approved' : 'Approve reply'}
            </Btn>
            <Btn variant="secondary" disabled={!text.trim()} onClick={() => saveDraft(o.id, tone, text)}>
              Save draft
            </Btn>
            {existing && (
              <Btn
                variant="ghost"
                onClick={() => {
                  discardDraft(o.id);
                  closeStudio();
                }}
              >
                Discard
              </Btn>
            )}
          </div>
          <p className="mt-4 text-[12.5px] leading-relaxed text-steel/60">
            {anyConnected
              ? 'Connection is simulated in the preview — approving won’t post anything.'
              : 'Nothing is posted from the preview. Publishing arrives with live X and Reddit connections.'}
          </p>
          {approved && (
            <div className="mt-3">
              <Tag tone="ok">
                <Check className="h-3 w-3" aria-hidden="true" /> Approved
              </Tag>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};
