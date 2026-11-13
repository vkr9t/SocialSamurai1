import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, X as XIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PersonalityId } from '../types';
import { ART, PERSONALITIES } from '../components/Site/content';
import { Btn, Field, cx, inputCls } from './ui';

const STEPS = ['Choose your Samurai', 'Describe your brand', 'Add keywords'];

export const Onboarding: React.FC = () => {
  const { finishOnboarding, profile, keywords: current, setCurrentView } = useApp();
  const [step, setStep] = useState(0);
  const [personality, setPersonality] = useState<PersonalityId>(profile.personality);
  const [brand, setBrand] = useState({ brand: '', product: '', audience: '', voice: '' });
  const [kws, setKws] = useState<string[]>(current.slice(0, 3));
  const [kw, setKw] = useState('');

  const canNext = step === 0 || (step === 1 ? brand.brand.trim() && brand.product.trim() : kws.length > 0);
  const finish = () =>
    finishOnboarding(
      {
        personality,
        brand: brand.brand.trim() || profile.brand,
        product: brand.product.trim() || profile.product,
        audience: brand.audience.trim() || profile.audience,
        voice: brand.voice.trim() || profile.voice,
      },
      kws
    );

  return (
    <div className="min-h-screen bg-black text-paper">
      <header className="flex h-16 items-center justify-between px-5 sm:px-8">
        <img src={ART.logo} alt="SocialSamurai" className="h-8 w-auto" />
        <button type="button" onClick={() => setCurrentView('landing')} className="text-[13.5px] text-steel/70 hover:text-paper">
          Back to website
        </button>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8 sm:px-8">
        <ol className="flex gap-2" aria-label="Progress">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <span className={cx('block h-1 rounded-full transition-colors', i <= step ? 'bg-samurai' : 'bg-white/10')} />
              <span className={cx('mt-2 block text-[12.5px]', i === step ? 'text-paper' : 'text-steel/55')} aria-current={i === step ? 'step' : undefined}>
                {i + 1}. {s}
              </span>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <section className="mt-10">
            <h1 className="si-d text-[clamp(1.8rem,1.4rem+1.8vw,2.6rem)]">Choose your Samurai.</h1>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-steel/70">Your personality sets the default style for drafts. You can change it, or the tone of any reply, later.</p>
            <div role="radiogroup" aria-label="Samurai personality" className="mt-8 grid gap-3 sm:grid-cols-2">
              {PERSONALITIES.map((p) => {
                const on = personality === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPersonality(p.key as PersonalityId)}
                    className={cx('flex gap-4 rounded-2xl p-4 text-left ring-1 transition-colors', on ? 'bg-samurai/10 ring-samurai/60' : 'bg-charcoal ring-white/[0.06] hover:ring-white/20')}
                  >
                    <img src={p.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    <span>
                      <span className="si-d-med block text-[18px] text-paper">{p.name}</span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-steel/70">{p.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="mt-10">
            <h1 className="si-d text-[clamp(1.8rem,1.4rem+1.8vw,2.6rem)]">Describe your brand.</h1>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-steel/70">This context is used to score conversations and write drafts that sound like you.</p>
            <div className="mt-8 space-y-4">
              <Field label="Brand or product name" htmlFor="ob-brand">
                <input id="ob-brand" value={brand.brand} onChange={(e) => setBrand({ ...brand, brand: e.target.value })} placeholder="e.g. Acme AI" className={inputCls} />
              </Field>
              <Field label="What you offer" htmlFor="ob-product">
                <textarea id="ob-product" rows={2} value={brand.product} onChange={(e) => setBrand({ ...brand, product: e.target.value })} placeholder="e.g. Accounting software for small businesses" className={cx(inputCls, 'resize-y')} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Audience (optional)" htmlFor="ob-aud">
                  <input id="ob-aud" value={brand.audience} onChange={(e) => setBrand({ ...brand, audience: e.target.value })} placeholder="e.g. Founders" className={inputCls} />
                </Field>
                <Field label="Brand voice (optional)" htmlFor="ob-voice">
                  <input id="ob-voice" value={brand.voice} onChange={(e) => setBrand({ ...brand, voice: e.target.value })} placeholder="e.g. Helpful, direct" className={inputCls} />
                </Field>
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mt-10">
            <h1 className="si-d text-[clamp(1.8rem,1.4rem+1.8vw,2.6rem)]">Add keywords.</h1>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-steel/70">Use the phrases your customers say when they need you — “alternative to…”, “any recommendations for…”.</p>
            <form
              className="mt-8 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const v = kw.trim();
                if (v && !kws.includes(v)) setKws([...kws, v]);
                setKw('');
              }}
            >
              <label htmlFor="ob-kw" className="sr-only">
                Keyword
              </label>
              <input id="ob-kw" value={kw} onChange={(e) => setKw(e.target.value)} placeholder="Add a phrase and press Enter" className={inputCls} />
              <Btn type="submit" variant="secondary" disabled={!kw.trim()} aria-label="Add keyword">
                <Plus className="h-4 w-4" />
              </Btn>
            </form>
            <ul className="mt-4 flex flex-wrap gap-2">
              {kws.map((k) => (
                <li key={k} className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] py-1.5 pl-3 pr-1.5 text-[13.5px]">
                  {k}
                  <button type="button" aria-label={`Remove ${k}`} onClick={() => setKws(kws.filter((x) => x !== k))} className="flex h-5 w-5 items-center justify-center rounded-full text-steel/60 hover:bg-white/10 hover:text-paper">
                    <XIcon className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 flex items-center justify-between">
          <Btn variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
          </Btn>
          {step < STEPS.length - 1 ? (
            <Btn variant="primary" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
              Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Btn>
          ) : (
            <Btn variant="primary" disabled={!canNext} onClick={finish}>
              Enter the workspace <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Btn>
          )}
        </div>
      </main>
    </div>
  );
};
