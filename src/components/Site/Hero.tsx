import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ART } from './content';
import { Wrap } from './kit';

const blade = [0.65, 0, 0.15, 1] as const;

export const Hero: React.FC = () => {
  const { enterApp } = useApp();
  const reduce = useReducedMotion();

  const fade = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: blade, delay } };

  return (
    <section id="top" aria-labelledby="hero-h" className="relative isolate overflow-hidden lg:min-h-[max(100svh,760px)]">
      {/* Ember glow behind the figure */}
      <div
        aria-hidden="true"
        className="si-ember pointer-events-none absolute left-1/2 top-[8%] -z-20 h-[70%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_33_182/0.45),rgb(139_92_246/0.12)_55%,transparent)] blur-3xl"
      />

      {/* The Samurai */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none relative -z-10 mx-auto mt-[68px] aspect-[1060/1014] w-[118%] max-w-none -translate-x-[8%] sm:w-[92%] sm:-translate-x-[3%] lg:absolute lg:left-1/2 lg:top-0 lg:mt-[24px] lg:h-[min(90svh,1000px)] lg:w-auto lg:-translate-x-[54%]"
        initial={reduce ? false : { scale: 1.05, filter: 'brightness(0.12)' }}
        animate={{ scale: 1, filter: 'brightness(1)' }}
        transition={{ duration: 2, ease: blade }}
      >
        <img
          src={ART.samurai}
          srcSet={`${ART.samuraiSmall} 640w, ${ART.samurai} 1060w`}
          sizes="(min-width: 1024px) 1000px, 100vw"
          alt=""
          width={1060}
          height={1014}
          fetchPriority="high"
          decoding="async"
          className="si-art-mask h-full w-full object-contain"
        />
      </motion.div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black via-black/70 to-transparent" />
      {/* Legibility: let the lower half of the art sink into black */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-[58%] bg-gradient-to-b from-transparent via-black/75 to-black lg:block" />

      {/* Side rails (desktop) */}
      <div aria-hidden="true" className="absolute right-6 top-1/2 hidden -translate-y-[60%] flex-col items-center gap-5 xl:right-10 lg:flex">
        <span className="si-jp si-vertical text-[19px] text-steel/80" lang="ja">
          会話を支配する
        </span>
        <span className="h-16 w-px bg-gradient-to-b from-samurai to-transparent" />
      </div>
      <p className="absolute left-6 top-1/2 hidden -translate-y-[60%] text-[12.5px] tracking-[0.06em] text-steel/60 [writing-mode:vertical-rl] rotate-180 xl:left-10 lg:block">
        Command the conversation on X and Reddit
      </p>

      {/* Copy */}
      <Wrap className="relative -mt-[22%] pb-20 text-center sm:-mt-[16%] lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:pb-[clamp(2rem,5vh,4rem)]">
        <h1 id="hero-h" className="si-d si-xl relative mx-auto max-w-[14ch] text-paper lg:w-fit lg:max-w-none lg:!text-[min(5.7vw,6.6rem)]">
          <span className="relative block bg-gradient-to-b from-white via-white to-[#c9c9c9] bg-clip-text text-transparent">
            {reduce ? (
              <>
                Find the conversations
                <br />
                worth joining.
              </>
            ) : (
              <motion.span
                className="block"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 1.1, ease: blade, delay: 0.35 }}
              >
                Find the conversations
                <br />
                worth joining.
              </motion.span>
            )}
          </span>
          {!reduce && (
            <motion.span
              aria-hidden="true"
              className="absolute top-0 h-full w-[2px] bg-samurai shadow-[0_0_24px_6px_rgb(139_92_246/0.8)]"
              initial={{ left: '0%', opacity: 0 }}
              animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1, ease: blade, delay: 0.35, times: [0, 0.1, 0.85, 1] }}
            />
          )}
        </h1>

        <motion.p {...fade(1.0)} className="si-body mx-auto mt-6 max-w-[46ch] text-steel/85 lg:max-w-[60ch]">
          SocialSamurai finds the X and Reddit threads where your customers are already talking, and helps you reply
          with something worth reading.
        </motion.p>

        <motion.div {...fade(1.12)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => enterApp('signup')} className="si-btn si-btn-primary group w-full sm:w-auto">
            Start your journey
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => enterApp('demo')}
            className="si-btn si-btn-ghost w-full sm:w-auto"
            aria-label="Watch the demo — opens the interactive product preview"
          >
            <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            Watch the demo
          </button>
        </motion.div>

        <motion.p {...fade(1.24)} className="mt-7 text-[13.5px] text-steel/60">
          You approve every reply · Built for X and Reddit
        </motion.p>
      </Wrap>
    </section>
  );
};
