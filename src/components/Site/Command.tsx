import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ART, CAPABILITIES, FAQS, NAV, PERSONALITIES, PERSONALITY_PROMPT, PRICING, STATUS } from './content';
import { Logo, Opener, Tag, Wrap } from './kit';

/* ================================================================== */
/* Personalities — six banners; the chosen one unfurls                 */
/* ================================================================== */

export const Personalities: React.FC = () => {
  const [active, setActive] = useState(1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = PERSONALITIES.length;
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % n : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i - 1 + n) % n : -1;
    if (next >= 0) {
      e.preventDefault();
      setActive(next);
      refs.current[next]?.focus();
    }
  };

  return (
    <section id="personalities" aria-labelledby="pers-h" className="relative border-t si-line py-28 sm:py-36">
      <Wrap>
        <Opener
          kanji="侍"
          meaning="Samurai"
          id="pers-h"
          title="Six Samurai. Six ways to show up."
          lead="Each personality is a strategy for joining a conversation. Choose one for your brand — every reply can still be re-toned."
        />

        <div className="mt-8 rounded-2xl bg-charcoal/70 p-4 text-[14.5px] leading-relaxed text-steel/80 ring-1 ring-white/[0.06] sm:max-w-[70ch]">
          <span className="text-steel/60">The same post, answered six ways:</span> “{PERSONALITY_PROMPT}”
        </div>

        <div className="mt-8 flex flex-col gap-2 lg:h-[540px] lg:flex-row" role="group" aria-label="Samurai personalities">
          {PERSONALITIES.map((p, i) => {
            const on = i === active;
            return (
              <motion.div
                key={p.key}
                layout
                transition={{ type: 'spring', stiffness: 260, damping: 32 }}
                className={`relative overflow-hidden rounded-[24px] ring-1 ${
                  on ? 'ring-samurai/50 lg:flex-[5]' : 'ring-white/[0.07] lg:flex-[1]'
                } bg-charcoal`}
              >
                <button
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  id={`pt-${p.key}`}
                  aria-expanded={on}
                  aria-controls={`pp-${p.key}`}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className="group flex w-full items-center gap-4 p-3 text-left lg:h-full lg:flex-col lg:items-stretch lg:p-0"
                >
                  <img
                    src={p.image}
                    alt=""
                    width={160}
                    height={160}
                    loading="lazy"
                    className={`h-14 w-14 shrink-0 rounded-xl object-cover transition-[filter,opacity] duration-500 lg:absolute lg:inset-0 lg:h-full lg:w-full lg:rounded-none ${
                      on ? 'lg:opacity-30 lg:blur-[2px]' : 'opacity-70 grayscale group-hover:opacity-100 group-hover:grayscale-0 lg:opacity-40'
                    }`}
                  />
                  <span className="lg:relative lg:z-10 lg:mt-auto lg:p-5">
                    <span className={`si-d block text-[22px] ${on ? 'text-paper' : 'text-steel/80'} ${!on ? 'lg:[writing-mode:vertical-rl] lg:rotate-180' : ''}`}>
                      {p.name}
                    </span>
                    <span className={`mt-1 block text-[13px] text-steel/65 ${!on ? 'lg:hidden' : ''}`}>{p.stance}</span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`pp-${p.key}`}
                      role="region"
                      aria-labelledby={`pt-${p.key}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.15 } }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      className="px-4 pb-5 lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:p-8"
                    >
                      <p className="max-w-[46ch] text-[14.5px] leading-relaxed text-steel/80">{p.description}</p>
                      <blockquote className="si-d-med mt-5 max-w-[34ch] border-l-2 border-samurai pl-4 text-[clamp(1.05rem,0.9rem+0.6vw,1.4rem)] leading-snug text-paper">
                        {p.sample}
                      </blockquote>
                      <p className="mt-4 text-[12.5px] text-steel/60">Example reply, written to show this style.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Wrap>
    </section>
  );
};

/* ================================================================== */
/* Approval — what the Samurai does vs. what you decide                */
/* ================================================================== */

const DOES = ['Finds the conversations', 'Scores and explains each one', 'Drafts a reply in your voice', 'Prepares posts and alerts on a schedule'];
const DECIDE = ['Which conversations to join', 'Every word of every reply', 'The tone, and when to regenerate', 'Whether anything is published at all'];

export const Approval: React.FC = () => (
  <section id="approval" aria-labelledby="appr-h" className="relative border-t si-line bg-graphite py-28 sm:py-36">
    <Wrap>
      <Opener
        center
        kanji="判"
        meaning="Judgement"
        id="appr-h"
        title="The AI draws. You decide."
        lead="SocialSamurai assists — it never posts on its own. Every reply and every post is a draft until you approve it."
      />
      <div className="mx-auto mt-16 grid max-w-5xl items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-[28px] p-7 ring-1 ring-white/[0.1] sm:p-9">
          <h3 className="si-d text-[20px] text-steel/80">SocialSamurai</h3>
          <ul className="mt-6 space-y-4">
            {DOES.map((d) => (
              <li key={d} className="text-[16.5px] text-steel/80">
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden="true" className="flex items-center justify-center md:flex-col">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-samurai md:h-16 md:w-px md:bg-gradient-to-b" />
          <img src={ART.mark} alt="" width={48} height={54} className="mx-3 h-12 w-auto md:mx-0 md:my-3" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-samurai md:h-16 md:w-px md:bg-gradient-to-t" />
        </div>
        <div className="rounded-[28px] bg-paper p-7 text-black sm:p-9">
          <h3 className="si-d text-[20px]">You</h3>
          <ul className="mt-6 space-y-4">
            {DECIDE.map((d) => (
              <li key={d} className="text-[16.5px] font-medium">
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Wrap>
  </section>
);

/* ================================================================== */
/* Spec sheet — every capability with its honest status                */
/* ================================================================== */

const statusTone = { Preview: 'violet', Prototype: 'plain', 'In development': 'muted' } as const;

export const SpecSheet: React.FC = () => (
  <section aria-labelledby="spec-h" className="relative border-t si-line py-28 sm:py-36">
    <Wrap className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Opener kanji="具" meaning="Equipment" id="spec-h" title="Everything in the kit." />
        <ul className="mt-8 space-y-3 text-[14px] text-steel/75" aria-label="Status key">
          <li className="flex items-center gap-3">
            <Tag tone="violet">Preview</Tag> Try it today with sample data.
          </li>
          <li className="flex items-center gap-3">
            <Tag tone="plain">Prototype</Tag> Early version; details will change.
          </li>
          <li className="flex items-center gap-3">
            <Tag tone="muted">In development</Tag> Being built now.
          </li>
        </ul>
      </div>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">SocialSamurai capabilities and their status</caption>
        <thead>
          <tr className="border-b si-line text-[13px] text-steel/60">
            <th scope="col" className="pb-3 pr-4 font-medium">Capability</th>
            <th scope="col" className="hidden pb-3 pr-4 font-medium sm:table-cell">What it does</th>
            <th scope="col" className="pb-3 text-right font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {CAPABILITIES.map((c) => (
            <tr key={c.name} className="border-b si-line align-top">
              <th scope="row" className="py-5 pr-4 font-normal">
                <span className="si-d-med block text-[17px] text-paper">{c.name}</span>
                <span className="mt-1 block text-[14px] leading-relaxed text-steel/70 sm:hidden">{c.does}</span>
              </th>
              <td className="hidden py-5 pr-4 text-[15px] leading-relaxed text-steel/75 sm:table-cell">{c.does}</td>
              <td className="py-5 text-right">
                <Tag tone={statusTone[c.status]}>{c.status}</Tag>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Wrap>
  </section>
);

/* ================================================================== */
/* Arena                                                               */
/* ================================================================== */

export const Arena: React.FC = () => {
  const { enterApp } = useApp();
  return (
    <section id="arena" aria-labelledby="arena-h" className="relative overflow-hidden border-t si-line py-28 sm:py-36">
      <Wrap className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <p aria-hidden="true" className="si-d si-outline select-none text-center text-[clamp(10rem,6rem+18vw,24rem)] leading-[0.8] lg:text-left">
          60
        </p>
        <div>
          <Opener
            kanji="道場"
            meaning="Dojo"
            id="arena-h"
            title="Sixty seconds in the Arena."
            lead="A short daily challenge that rewards consistency — the habit that actually grows an audience. Win rounds, earn credits, spend them on your real work."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {['60-second battles', 'Daily credits', 'Progression and rewards'].map((t) => (
              <li key={t}>
                <Tag tone="plain">{t}</Tag>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[14px] text-steel/65">Early prototype. Rules and rewards are still being designed.</p>
          <button type="button" onClick={() => enterApp('arena')} className="si-btn si-btn-ghost group mt-8">
            Enter the Arena prototype
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        </div>
      </Wrap>
    </section>
  );
};

/* ================================================================== */
/* Pricing                                                             */
/* ================================================================== */

export const Pricing: React.FC = () => {
  const { enterApp } = useApp();
  const [yearly, setYearly] = useState(true);
  const save = Math.round((1 - PRICING.yearly / (PRICING.monthly * 12)) * 100);
  const price = yearly ? PRICING.yearly : PRICING.monthly;

  return (
    <section id="pricing" aria-labelledby="price-h" className="relative overflow-hidden border-t si-line py-28 sm:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_33_182/0.32),transparent)] blur-2xl"
      />
      <Wrap className="relative text-center">
        <Opener center kanji="価" meaning="Price" id="price-h" title="One plan. Everything in it." />

        <div className="mt-10 inline-flex items-center gap-4 text-[15px]">
          <span className={yearly ? 'text-steel/60' : 'text-paper'}>Monthly</span>
          <button
            type="button"
            role="switch"
            aria-checked={yearly}
            aria-label="Bill yearly"
            onClick={() => setYearly((v) => !v)}
            className={`relative h-8 w-14 rounded-full transition-colors ${yearly ? 'bg-samurai' : 'bg-white/15'}`}
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 34 }}
              className={`absolute top-1 h-6 w-6 rounded-full bg-white ${yearly ? 'right-1' : 'left-1'}`}
            />
          </button>
          <span className={yearly ? 'text-paper' : 'text-steel/60'}>
            Yearly <span className="text-[#d3c4fd]">· save {save}%</span>
          </span>
        </div>

        <div className="mt-10" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={price}
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.3 }}
              className="si-d text-[clamp(5rem,3rem+9vw,10rem)] leading-none text-paper"
            >
              {PRICING.currency}
              {price}
            </motion.p>
          </AnimatePresence>
          <p className="mt-3 text-[16px] text-steel/75">
            {yearly
              ? `per year — ${PRICING.currency}${(PRICING.yearly / 12).toFixed(2)} a month`
              : `per month — or ${PRICING.currency}${PRICING.yearly} billed yearly`}
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-[52ch] text-[15.5px] leading-relaxed text-steel/80">
          The full SocialSamurai workspace for X and Reddit: discovery, scoring, Reply Studio, personalities, analytics and the Arena.
        </p>

        <button type="button" onClick={() => enterApp('signup')} className="si-btn si-btn-primary group mt-10">
          Start your journey
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
        <p className="mx-auto mt-6 max-w-[54ch] text-[13px] leading-relaxed text-steel/60">{PRICING.note}</p>
      </Wrap>
    </section>
  );
};

/* ================================================================== */
/* FAQ — all answers open, two columns                                 */
/* ================================================================== */

export const Faq: React.FC = () => (
  <section id="resources" aria-labelledby="faq-h" className="relative border-t si-line py-28 sm:py-36">
    <Wrap>
      <Opener kanji="問" meaning="Questions" id="faq-h" title="Asked and answered." lead={STATUS.long} />
      <dl className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
        {FAQS.map((f) => (
          <div key={f.q}>
            <dt className="si-d-med text-[19px] leading-snug text-paper">{f.q}</dt>
            <dd className="mt-3 max-w-[54ch] text-[15.5px] leading-relaxed text-steel/75">{f.a}</dd>
          </div>
        ))}
      </dl>
    </Wrap>
  </section>
);

/* ================================================================== */
/* Final call                                                          */
/* ================================================================== */

export const FinalCall: React.FC = () => {
  const { enterApp } = useApp();
  return (
    <section aria-labelledby="final-h" className="relative isolate overflow-hidden border-t si-line py-28 text-center sm:py-36">
      <div aria-hidden="true" className="relative mx-auto h-[300px] w-[340px] sm:h-[380px] sm:w-[440px]">
        <div className="si-ember absolute inset-[15%] rounded-full bg-[radial-gradient(closest-side,rgb(139_92_246/0.45),transparent)] blur-2xl" />
        <img
          src={ART.samuraiSmall}
          alt=""
          width={640}
          height={612}
          loading="lazy"
          className="relative h-full w-full object-cover object-[52%_6%] [mask-image:radial-gradient(ellipse_50%_58%_at_50%_42%,#000_45%,transparent_100%)]"
        />
      </div>
      <Wrap>
        <h2 id="final-h" className="si-d si-l mx-auto -mt-10 max-w-[16ch] text-paper">
          Stop scrolling. Start engaging.
        </h2>
        <p className="si-body si-dim mx-auto mt-6 max-w-[46ch]">
          Find the conversations worth joining, and let SocialSamurai help you turn attention into real engagement.
        </p>
        <button type="button" onClick={() => enterApp('signup')} className="si-btn si-btn-primary group mt-10">
          Start your journey
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </Wrap>
    </section>
  );
};

/* ================================================================== */
/* Footer                                                              */
/* ================================================================== */

export const Footer: React.FC = () => {
  const { enterApp } = useApp();
  const link = 'text-[14.5px] text-steel/70 transition-colors hover:text-paper';
  return (
    <footer className="border-t si-line">
      <Wrap className="flex flex-col gap-12 py-16 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-[14.5px] leading-relaxed text-steel/70">
            The AI-powered social command center for finding — and joining — the conversations that matter on X and Reddit.
          </p>
          <p className="si-jp mt-6 text-[15px] text-samurai" lang="ja">
            会話を支配する
            <span className="ml-3 font-sans text-[13px] font-normal text-steel/60" lang="en">
              Command the conversation
            </span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <nav aria-label="Product">
            <p className="text-[13px] font-semibold text-paper">Product</p>
            <ul className="mt-4 space-y-3">
              {NAV.filter((n) => n.id !== 'resources').map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className={link}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Resources">
            <p className="text-[13px] font-semibold text-paper">Resources</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#resources" className={link}>
                  Questions
                </a>
              </li>
              <li>
                <button type="button" onClick={() => enterApp('demo')} className={link}>
                  Interactive preview
                </button>
              </li>
              <li>
                <button type="button" onClick={() => enterApp('arena')} className={link}>
                  Arena prototype
                </button>
              </li>
            </ul>
          </nav>
          <div>
            <p className="text-[13px] font-semibold text-paper">Account</p>
            <ul className="mt-4 space-y-3">
              <li>
                <button type="button" onClick={() => enterApp('login')} className={link}>
                  Log in
                </button>
              </li>
              <li>
                <button type="button" onClick={() => enterApp('signup')} className={link}>
                  Get started
                </button>
              </li>
            </ul>
          </div>
        </div>
      </Wrap>
      <Wrap className="flex flex-col gap-2 border-t si-line py-6 text-[13px] text-steel/60 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} SocialSamurai · {STATUS.short}</p>
        <p>Privacy policy and terms will be published before public launch.</p>
      </Wrap>
    </footer>
  );
};
