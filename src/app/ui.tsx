import React from 'react';
import type { PlatformType } from '../types';

/* ------------------------------------------------------------------ */
/* App UI kit — Steel & Ink, tuned for working screens                 */
/* ------------------------------------------------------------------ */

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { pad?: boolean }> = ({ className, pad = true, ...p }) => (
  <div className={cx('rounded-2xl bg-charcoal ring-1 ring-white/[0.06]', pad && 'p-5 sm:p-6', className)} {...p} />
);

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md';
};
export const Btn: React.FC<BtnProps> = ({ variant = 'secondary', size = 'md', className, type = 'button', ...p }) => (
  <button
    type={type}
    className={cx(
      'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,box-shadow,color,border-color] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-40',
      size === 'sm' ? 'h-8 px-3.5 text-[13px]' : 'h-10 px-4.5 text-[14px]',
      variant === 'primary' && 'bg-white text-black hover:shadow-[0_0_0_3px_rgb(139_92_246/0.35)]',
      variant === 'accent' && 'bg-deep text-white hover:bg-[#6a2fd0]',
      variant === 'secondary' && 'text-paper ring-1 ring-inset ring-white/15 hover:bg-white/[0.05] hover:ring-white/30',
      variant === 'ghost' && 'text-steel/80 hover:bg-white/[0.05] hover:text-paper',
      variant === 'danger' && 'text-steel/80 hover:bg-white/[0.05] hover:text-paper',
      className
    )}
    {...p}
  />
);

export const Tag: React.FC<{ children: React.ReactNode; tone?: 'violet' | 'plain' | 'muted' | 'ok'; className?: string }> = ({
  children,
  tone = 'plain',
  className,
}) => (
  <span
    className={cx(
      'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium leading-none ring-1 ring-inset',
      tone === 'violet' && 'bg-samurai/15 text-[#d3c4fd] ring-samurai/40',
      tone === 'plain' && 'bg-white/[0.06] text-steel ring-white/12',
      tone === 'muted' && 'text-steel/70 ring-white/12',
      tone === 'ok' && 'bg-white text-black ring-white',
      className
    )}
  >
    {children}
  </span>
);

export const PageHeader: React.FC<{ title: string; lead?: React.ReactNode; actions?: React.ReactNode }> = ({ title, lead, actions }) => (
  <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="si-d-med text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] leading-tight text-paper">{title}</h1>
      {lead && <p className="mt-2 max-w-[62ch] text-[14.5px] leading-relaxed text-steel/70">{lead}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode; action?: React.ReactNode }> = ({ children, action }) => (
  <div className="mb-4 flex items-center justify-between gap-4">
    <h2 className="font-sans text-[15px] font-semibold text-paper">{children}</h2>
    {action}
  </div>
);

export const XGlyph: React.FC<{ className?: string }> = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.48 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43Z" />
  </svg>
);

export const RedditGlyph: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <ellipse cx="12" cy="14" rx="7" ry="5" />
    <circle cx="18.6" cy="9.8" r="1.6" />
    <circle cx="5.4" cy="9.8" r="1.6" />
    <circle cx="16.8" cy="4.6" r="1.4" />
    <path d="M12 9.4 13.2 4.4l3.4.6" stroke="currentColor" strokeWidth="1.1" fill="none" />
    <circle cx="9.4" cy="13.4" r="1.1" fill="#1a1a1a" />
    <circle cx="14.6" cy="13.4" r="1.1" fill="#1a1a1a" />
  </svg>
);

export const PlatformBadge: React.FC<{ platform: PlatformType; withLabel?: boolean }> = ({ platform, withLabel }) => (
  <span className="inline-flex items-center gap-1.5 text-[12.5px] text-steel/80">
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.07] text-paper">
      {platform === 'x' ? <XGlyph /> : <RedditGlyph />}
    </span>
    {withLabel && (platform === 'x' ? 'X' : 'Reddit')}
    {!withLabel && <span className="sr-only">{platform === 'x' ? 'X' : 'Reddit'}</span>}
  </span>
);

export const Initials: React.FC<{ name: string; size?: 'sm' | 'md' }> = ({ name, size = 'md' }) => {
  const letters = name
    .replace(/^[@u/]+/, '')
    .split(/[\s_.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <span
      aria-hidden="true"
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full bg-white/[0.08] font-semibold text-steel ring-1 ring-white/10',
        size === 'sm' ? 'h-8 w-8 text-[11px]' : 'h-10 w-10 text-[13px]'
      )}
    >
      {letters}
    </span>
  );
};

export const ScoreDial: React.FC<{ score: number; size?: number }> = ({ score, size = 44 }) => {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-label={`Score ${score} of 100`}>
      <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="3" />
        <circle cx="22" cy="22" r={r} fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} />
      </svg>
      <span className="relative text-[13px] font-semibold tabular-nums text-paper">{score}</span>
    </span>
  );
};

export const Toggle: React.FC<{ checked: boolean; onChange: () => void; label: string; disabled?: boolean }> = ({ checked, onChange, label, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={onChange}
    className={cx('relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60', checked ? 'bg-samurai' : 'bg-white/15')}
  >
    <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-[left] duration-200', checked ? 'left-[22px]' : 'left-0.5')} />
  </button>
);

export const Empty: React.FC<{ title: string; body: string; action?: React.ReactNode }> = ({ title, body, action }) => (
  <div className="flex flex-col items-center rounded-2xl px-6 py-14 text-center ring-1 ring-dashed ring-white/10">
    <p className="text-[15px] font-semibold text-paper">{title}</p>
    <p className="mt-2 max-w-[44ch] text-[14px] leading-relaxed text-steel/65">{body}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const Field: React.FC<{ label: string; htmlFor: string; hint?: string; children: React.ReactNode }> = ({ label, htmlFor, hint, children }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-2 block text-[13px] font-medium text-steel/85">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1.5 text-[12.5px] text-steel/60">{hint}</p>}
  </div>
);

export const inputCls =
  'w-full rounded-xl bg-black/40 px-3.5 py-2.5 text-[14.5px] text-paper ring-1 ring-inset ring-white/12 placeholder:text-steel/40 focus:outline-none focus:ring-samurai/60';
