import React, { useState } from 'react';
import { Lock, Plus, ShieldCheck, X as XIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PersonalityId, PlatformType } from '../../types';
import { PERSONALITIES } from '../../components/Site/content';
import { Dialog } from '../Shell';
import { Btn, Card, Field, PageHeader, RedditGlyph, SectionTitle, Tag, Toggle, XGlyph, cx, inputCls } from '../ui';

/* ================================================================== */
/* Connections                                                         */
/* ================================================================== */

const PLATFORM_INFO: Record<PlatformType, { name: string; does: string[] }> = {
  x: { name: 'X', does: ['Search public posts for your keywords', 'Publish replies and posts you approve', 'Read mentions for your inbox'] },
  reddit: { name: 'Reddit', does: ['Search subreddits for your keywords', 'Publish comments and posts you approve', 'Read replies for your inbox'] },
};

export const Connections: React.FC = () => {
  const { accounts, connectAccount, disconnectAccount } = useApp();
  const [pending, setPending] = useState<PlatformType | null>(null);

  return (
    <div>
      <PageHeader title="Connections" lead="Link the accounts SocialSamurai discovers and publishes through. Supported: X and Reddit." />
      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((a) => {
          const info = PLATFORM_INFO[a.platform];
          return (
            <Card key={a.platform} className="flex flex-col">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07] text-paper">
                  {a.platform === 'x' ? <XGlyph className="h-5 w-5" /> : <RedditGlyph className="h-6 w-6" />}
                </span>
                <div className="flex-1">
                  <p className="text-[16px] font-semibold text-paper">{info.name}</p>
                  <p className="text-[13px] text-steel/65">{a.connected ? a.handle : 'Not connected'}</p>
                </div>
                {a.connected ? <Tag tone="violet">Connected · simulated</Tag> : <Tag tone="muted">Not connected</Tag>}
              </div>
              <ul className="mt-5 flex-1 space-y-2 text-[13.5px] text-steel/75">
                {info.does.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-steel/50" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                {a.connected ? (
                  <Btn variant="secondary" onClick={() => disconnectAccount(a.platform)}>
                    Disconnect
                  </Btn>
                ) : (
                  <Btn variant="primary" onClick={() => setPending(a.platform)}>
                    Connect {info.name}
                  </Btn>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      <Card className="mt-6 flex items-start gap-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-samurai" aria-hidden="true" />
        <p className="text-[14px] leading-relaxed text-steel/75">
          Live connections will use each platform’s official sign-in, so SocialSamurai never sees your password. Publishing always needs your approval, and you can disconnect at any time.
        </p>
      </Card>

      <Dialog open={!!pending} onClose={() => setPending(null)} title={`Connect ${pending ? PLATFORM_INFO[pending].name : ''}`}>
        <p className="text-[14.5px] leading-relaxed text-steel/75">
          Live {pending ? PLATFORM_INFO[pending].name : ''} connections are in development. In the preview you can simulate a connection to explore the full workflow — no account is linked and nothing is posted.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setPending(null)}>
            Cancel
          </Btn>
          <Btn
            variant="primary"
            onClick={() => {
              if (pending) connectAccount(pending);
              setPending(null);
            }}
          >
            Simulate connection
          </Btn>
        </div>
      </Dialog>
    </div>
  );
};

/* ================================================================== */
/* Automations                                                         */
/* ================================================================== */

export const Automations: React.FC = () => {
  const { rules, toggleRule } = useApp();
  return (
    <div>
      <PageHeader title="Automations" lead="Let SocialSamurai do the repetitive work on a schedule. Rules run on sample data in the preview." />
      <Card pad={false}>
        <ul className="divide-y divide-white/[0.06]">
          {rules.map((r) => (
            <li key={r.id} className="flex items-center gap-4 p-5 sm:p-6">
              <div className="flex-1">
                <p className="text-[15px] font-medium text-paper">{r.title}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-steel/70">{r.description}</p>
              </div>
              <Toggle checked={r.enabled} onChange={() => toggleRule(r.id)} label={r.title} />
            </li>
          ))}
          <li className="flex items-center gap-4 bg-black/30 p-5 sm:p-6">
            <div className="flex-1">
              <p className="flex items-center gap-2 text-[15px] font-medium text-paper">
                <Lock className="h-4 w-4 text-samurai" aria-hidden="true" /> Publishing requires your approval
              </p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-steel/70">Automations can find conversations and prepare drafts. They can never publish on their own.</p>
            </div>
            <Toggle checked onChange={() => undefined} label="Publishing requires approval (always on)" disabled />
          </li>
        </ul>
      </Card>
    </div>
  );
};

/* ================================================================== */
/* Settings                                                            */
/* ================================================================== */

export const Settings: React.FC = () => {
  const { profile, updateProfile, keywords, addKeyword, removeKeyword, toast, setPricingOpen } = useApp();
  const [form, setForm] = useState(profile);
  const [kw, setKw] = useState('');
  const dirty = JSON.stringify(form) !== JSON.stringify(profile);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div>
      <PageHeader title="Settings" lead="Your brand context shapes every opportunity score and every draft." />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <SectionTitle>Brand profile</SectionTitle>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(form);
              toast('Brand profile saved');
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" htmlFor="s-name">
                <input id="s-name" value={form.name} onChange={set('name')} className={inputCls} />
              </Field>
              <Field label="Brand" htmlFor="s-brand">
                <input id="s-brand" value={form.brand} onChange={set('brand')} className={inputCls} />
              </Field>
            </div>
            <Field label="What you offer" htmlFor="s-product">
              <textarea id="s-product" rows={2} value={form.product} onChange={set('product')} className={cx(inputCls, 'resize-y')} />
            </Field>
            <Field label="Audience" htmlFor="s-aud">
              <input id="s-aud" value={form.audience} onChange={set('audience')} className={inputCls} />
            </Field>
            <Field label="Brand voice" htmlFor="s-voice" hint="A few words, e.g. helpful, direct, no hype.">
              <input id="s-voice" value={form.voice} onChange={set('voice')} className={inputCls} />
            </Field>
            <div className="flex gap-2 pt-1">
              <Btn type="submit" variant="primary" disabled={!dirty}>
                Save changes
              </Btn>
              {dirty && (
                <Btn variant="ghost" onClick={() => setForm(profile)}>
                  Reset
                </Btn>
              )}
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle>Keywords</SectionTitle>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                addKeyword(kw);
                setKw('');
              }}
            >
              <label htmlFor="s-kw" className="sr-only">
                Add keyword
              </label>
              <input id="s-kw" value={kw} onChange={(e) => setKw(e.target.value)} placeholder="Add a phrase" className={inputCls} />
              <Btn type="submit" variant="secondary" disabled={!kw.trim()} aria-label="Add keyword">
                <Plus className="h-4 w-4" />
              </Btn>
            </form>
            <ul className="mt-4 flex flex-wrap gap-2">
              {keywords.map((k) => (
                <li key={k} className="inline-flex items-center gap-1 rounded-full bg-white/[0.07] py-1.5 pl-3 pr-1.5 text-[13px] text-paper">
                  {k}
                  <button type="button" aria-label={`Remove ${k}`} onClick={() => removeKeyword(k)} className="flex h-5 w-5 items-center justify-center rounded-full text-steel/60 hover:bg-white/10 hover:text-paper">
                    <XIcon className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionTitle>Samurai personality</SectionTitle>
            <div role="radiogroup" aria-label="Samurai personality" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PERSONALITIES.map((p) => {
                const on = profile.personality === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => {
                      updateProfile({ personality: p.key as PersonalityId });
                      setForm((f) => ({ ...f, personality: p.key as PersonalityId }));
                    }}
                    className={cx('flex items-center gap-2.5 rounded-xl p-2.5 text-left ring-1 transition-colors', on ? 'bg-samurai/10 ring-samurai/50' : 'ring-white/10 hover:ring-white/25')}
                  >
                    <img src={p.image} alt="" className="h-9 w-9 rounded-lg object-cover" />
                    <span>
                      <span className="block text-[13.5px] font-medium text-paper">{p.name}</span>
                      <span className="block text-[11.5px] text-steel/60">{p.stance}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card>
            <SectionTitle>Plan</SectionTitle>
            <p className="text-[14px] leading-relaxed text-steel/75">You’re using the free interactive preview. Paid plans aren’t available yet.</p>
            <Btn variant="secondary" className="mt-4" onClick={() => setPricingOpen(true)}>
              See proposed pricing
            </Btn>
          </Card>
        </div>
      </div>
    </div>
  );
};
