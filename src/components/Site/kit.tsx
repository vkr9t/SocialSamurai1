import React from 'react';
import { ART } from './content';

export const Wrap: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>
);

export const Logo: React.FC<{ className?: string; onClick?: () => void }> = ({ className = 'h-9 sm:h-10', onClick }) => (
  <a href="#top" onClick={onClick} aria-label="SocialSamurai home" className="inline-flex shrink-0 items-center">
    <picture>
      <source srcSet={ART.logo} type="image/webp" />
      <img src={ART.logoFallback} alt="SocialSamurai" width={323} height={96} className={`${className} w-auto`} decoding="async" />
    </picture>
  </a>
);

/** Section opener: kanji + its English meaning, then the heading. */
export const Opener: React.FC<{
  kanji: string;
  meaning: string;
  id: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  center?: boolean;
  className?: string;
}> = ({ kanji, meaning, id, title, lead, center, className = '' }) => (
  <header className={`${center ? 'mx-auto text-center' : ''} max-w-4xl ${className}`}>
    <p className={`flex items-center gap-3 text-[14px] text-steel/70 ${center ? 'justify-center' : ''}`}>
      <span className="si-jp text-[20px] text-samurai" lang="ja">
        {kanji}
      </span>
      <span>{meaning}</span>
    </p>
    <h2 id={id} className="si-d si-l mt-5 text-paper">
      {title}
    </h2>
    {lead && <p className={`si-body si-dim mt-6 max-w-[58ch] ${center ? 'mx-auto' : ''}`}>{lead}</p>}
  </header>
);

export const Tag: React.FC<{ children: React.ReactNode; tone?: 'violet' | 'plain' | 'muted' }> = ({ children, tone = 'plain' }) => {
  const tones = {
    violet: 'bg-samurai/15 text-[#d3c4fd] ring-samurai/40',
    plain: 'bg-white/[0.06] text-steel ring-white/15',
    muted: 'bg-transparent text-steel/70 ring-white/15',
  };
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium leading-none ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
};
