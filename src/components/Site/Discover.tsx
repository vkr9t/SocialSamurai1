import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Check, Plus, X as XIcon } from 'lucide-react';
import { MANIFESTO, RADAR_POOL, RADAR_SUGGESTIONS, RadarPost, STEPS } from './content';
import { Opener, Tag, Wrap } from './kit';

/* ================================================================== */
/* Manifesto — words light up as you scroll                            */
/* ================================================================== */

const Word: React.FC<{ word: string; progress: MotionValue<number>; range: [number, number] }> = ({ word, progress, range }) => {
  const opacity = useTransform(progress, range, [0.5, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{' '}
    </motion.span>
  );
};

export const Manifesto: React.FC = () => {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });
  const words = MANIFESTO.split(' ');
  return (
    <section aria-labelledby="manifesto-h" className="relative py-28 sm:py-40">
      <Wrap>
        <h2 id="manifesto-h" className="flex items-center gap-3 text-[14px] text-steel/70">
          <span className="si-jp text-[20px] text-samurai" lang="ja">
            聞
          </span>
          Your audience is already talking.
        </h2>
        <p ref={ref} className="si-d-med mt-8 max-w-[30ch] text-[clamp(1.7rem,1rem+2.6vw,3.6rem)] leading-[1.14] text-paper">
          {reduce
            ? MANIFESTO
            : words.map((w, i) => <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />)}
        </p>
      </Wrap>
    </section>
  );
};

/* ================================================================== */
/* Radar — a live, client-side demo with sample conversations          */
/* ================================================================== */

function scorePost(p: RadarPost, kws: string[]) {
  const hay = (p.text + ' ' + p.tags.join(' ')).toLowerCase();
  const matched = kws.filter((k) => hay.includes(k.toLowerCase().trim()));
  const score = matched.length ? Math.min(98, p.base + 14 * matched.length) : Math.max(12, p.base - 34);
  return { score, matched };
}

export const Radar: React.FC = () => {
  const [kws, setKws] = useState<string[]>(['recommendations', 'alternative to']);
  const [draft, setDraft] = useState('');
  const [selected, setSelected] = useState<string>('a');

  const ranked = useMemo(
    () =>
      RADAR_POOL.map((p) => ({ p, ...scorePost(p, kws) })).sort((a, b) => b.score - a.score),
    [kws]
  );
  const current = ranked.find((r) => r.p.id === selected) ?? ranked[0];

  const add = (k: string) => {
    const v = k.trim().toLowerCase();
    if (!v || kws.includes(v) || kws.length >= 6) return;
    setKws([...kws, v]);
  };

  return (
    <section id="features" aria-labelledby="radar-h" className="relative border-t si-line py-28 sm:py-36">
      <Wrap>
        <Opener
          kanji="探"
          meaning="Search"
          id="radar-h"
          title="Type what your customers say."
          lead="Add the phrases people use when they need something like your product. SocialSamurai ranks the conversations by how worth joining they are, and tells you why."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* Left: keywords + ranked feed */}
          <div className="rounded-[28px] bg-charcoal p-5 ring-1 ring-white/[0.06] sm:p-7">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                add(draft);
                setDraft('');
              }}
              className="flex flex-wrap items-center gap-2 rounded-2xl bg-black/50 p-2 ring-1 ring-white/10 focus-within:ring-samurai/60"
            >
              {kws.map((k) => (
                <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] py-1.5 pl-3 pr-1.5 text-[13.5px] text-paper">
                  {k}
                  <button
                    type="button"
                    onClick={() => setKws(kws.filter((x) => x !== k))}
                    aria-label={`Remove ${k}`}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-steel/70 hover:bg-white/10 hover:text-paper"
                  >
                    <XIcon className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))}
              <label htmlFor="radar-input" className="sr-only">
                Add a keyword
              </label>
              <input
                id="radar-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={kws.length >= 6 ? 'Up to 6 keywords' : 'Add a phrase and press Enter'}
                disabled={kws.length >= 6}
                className="min-w-[10rem] flex-1 bg-transparent px-2 py-1.5 text-[14.5px] text-paper placeholder:text-steel/45 focus:outline-none"
              />
            </form>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {RADAR_SUGGESTIONS.filter((s) => !kws.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => add(s)}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12.5px] text-steel/70 ring-1 ring-white/12 transition-colors hover:text-paper hover:ring-white/30"
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                  {s}
                </button>
              ))}
            </div>

            <ul className="mt-6 space-y-2" aria-label="Ranked conversations">
              {ranked.map(({ p, score, matched }) => {
                const on = current.p.id === p.id;
                const weak = matched.length === 0;
                return (
                  <motion.li key={p.id} layout transition={{ type: 'spring', stiffness: 380, damping: 34 }}>
                    <button
                      type="button"
                      onClick={() => setSelected(p.id)}
                      aria-pressed={on}
                      className={`grid w-full grid-cols-[3.25rem_1fr] items-start gap-4 rounded-2xl p-3.5 text-left transition-[background-color,opacity] ${
                        on ? 'bg-white/[0.07] ring-1 ring-samurai/50' : 'hover:bg-white/[0.035]'
                      }`}
                    >
                      <span className="flex flex-col items-center">
                        <span className={`si-d text-[24px] tabular-nums ${weak && !on ? 'text-steel/70' : 'text-paper'}`}>{score}</span>
                        <span className="mt-1 h-1 w-9 overflow-hidden rounded-full bg-white/10">
                          <span className="block h-full rounded-full bg-samurai" style={{ width: `${score}%` }} />
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12.5px] text-steel/70">
                          {p.platform} · {p.where} · {p.age} ago
                        </span>
                        <span className={`mt-1 block text-[14px] leading-relaxed line-clamp-2 ${weak && !on ? 'text-steel/75' : 'text-paper/90'}`}>{p.text}</span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Right: why + draft */}
          <div className="rounded-[28px] p-5 ring-1 ring-white/[0.1] sm:p-7" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.p.id + current.score}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone="violet">{current.p.intent}</Tag>
                  {current.matched.map((m) => (
                    <Tag key={m} tone="muted">
                      matches “{m}”
                    </Tag>
                  ))}
                </div>
                <p className="mt-5 text-[15.5px] leading-relaxed text-paper">{current.p.text}</p>
                <div className="mt-6 border-t si-line pt-5">
                  <p className="text-[13px] font-medium text-steel/80">Why it’s worth joining</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-steel/80">
                    {current.matched.length ? current.p.why : 'None of your phrases appear here, so it ranks low. Add a matching phrase to see it rise.'}
                  </p>
                </div>
                <div className="mt-6 rounded-2xl bg-charcoal p-4">
                  <p className="text-[13px] font-medium text-steel/80">Suggested reply</p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-paper/90">{current.p.draft}</p>
                  <p className="mt-4 flex items-center gap-2 text-[12.5px] text-steel/65">
                    <Check className="h-3.5 w-3.5 text-samurai" aria-hidden="true" />
                    Waits for your approval. This demo never posts.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-5 text-[13px] text-steel/60">Sample conversations, written for this demo. Scores are illustrative.</p>
      </Wrap>
    </section>
  );
};

/* ================================================================== */
/* Workflow — horizontal scroll on large screens                       */
/* ================================================================== */

const StepPanel: React.FC<{ i: number }> = ({ i }) => {
  const s = STEPS[i];
  return (
    <article className="relative flex h-full flex-col justify-between rounded-[32px] bg-charcoal p-7 ring-1 ring-white/[0.06] sm:p-10">
      <div className="flex items-start justify-between gap-6">
        <span className="text-[14px] tabular-nums text-steel/65">
          Step {i + 1} of {STEPS.length}
        </span>
        <span className="text-[13px] text-steel/60">{s.reading}</span>
      </div>
      <p className="si-jp my-8 text-[clamp(4.5rem,3rem+6vw,9rem)] leading-none text-paper/95" lang="ja" aria-hidden="true">
        {s.kanji}
      </p>
      <div>
        <h3 className="si-d si-m text-paper">{s.title}</h3>
        <p className="mt-3 max-w-[38ch] text-[16px] leading-relaxed text-steel/75">{s.body}</p>
      </div>
    </article>
  );
};

export const Workflow: React.FC = () => {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    const measure = () => {
      if (!rail.current) return;
      const pad = Math.max(48, (window.innerWidth - 1320) / 2 + 48);
      setDistance(Math.max(0, rail.current.scrollWidth - window.innerWidth + pad));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const heading = (
    <Opener
      kanji="道"
      meaning="The way"
      id="hiw-h"
      title="Five moves. One discipline."
      lead="From the first sign of a relevant conversation to knowing which replies worked."
    />
  );

  return (
    <section id="how-it-works" aria-labelledby="hiw-h" className="relative border-t si-line">
      {/* Stacked layout: phones, tablets and reduced motion */}
      <div className={reduce ? 'block py-28' : 'block py-28 lg:hidden'}>
        <Wrap>
          {heading}
          <ol className="mt-12 grid gap-4 md:grid-cols-2">
            {STEPS.map((s, i) => (
              <li key={s.key} className="min-h-[340px]">
                <StepPanel i={i} />
              </li>
            ))}
          </ol>
        </Wrap>
      </div>

      {/* Pinned horizontal layout */}
      {!reduce && (
        <div ref={track} className="relative hidden h-[360vh] lg:block">
          <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-[68px]">
            <Wrap>{heading}</Wrap>
            <motion.ol ref={rail} style={{ x }} className="mt-12 flex w-max gap-5 pl-[max(3rem,calc((100vw-1320px)/2+3rem))]">
              {STEPS.map((s, i) => (
                <li key={s.key} className="h-[min(52vh,470px)] w-[min(46vw,620px)]">
                  <StepPanel i={i} />
                </li>
              ))}
            </motion.ol>
            <Wrap className="mt-10">
              <div className="h-px w-full bg-white/10">
                <motion.div style={{ width: bar }} className="h-px bg-samurai shadow-[0_0_12px_rgb(139_92_246/0.9)]" />
              </div>
            </Wrap>
          </div>
        </div>
      )}
    </section>
  );
};
