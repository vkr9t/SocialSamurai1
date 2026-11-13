import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAV } from './content';
import { Logo, Wrap } from './kit';

function useActive(ids: readonly string[]) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (es) => {
        const v = es.filter((e) => e.isIntersecting);
        if (v[0]) setActive(v[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    els.forEach((el) => io.observe(el));
    const top = () => window.scrollY < 300 && setActive('');
    window.addEventListener('scroll', top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', top);
    };
  }, [ids]);
  return active;
}

const ids = NAV.map((n) => n.id);

export const Header: React.FC = () => {
  const { enterApp } = useApp();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActive(ids);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', k);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', k);
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    }, 40);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-[background-color,backdrop-filter,box-shadow] duration-500 ${
          solid || open ? 'bg-black/80 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <Wrap className="flex h-[68px] items-center gap-8">
          <Logo onClick={() => setOpen(false)} />
          <nav aria-label="Primary" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={go(n.id)}
                    aria-current={active === n.id ? 'true' : undefined}
                    className={`relative py-2 text-[14.5px] transition-colors ${
                      active === n.id ? 'text-paper' : 'text-steel/70 hover:text-paper'
                    }`}
                  >
                    {active === n.id && (
                      <motion.span
                        layoutId="hdr-dot"
                        className="absolute -left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-samurai shadow-[0_0_10px_2px_rgb(139_92_246/0.7)]"
                      />
                    )}
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-6">
            <button type="button" onClick={() => enterApp('login')} className="hidden px-3 py-2 text-[14.5px] text-steel/80 hover:text-paper sm:block">
              Log in
            </button>
            <button type="button" onClick={() => enterApp('signup')} className="si-btn si-btn-primary hidden !h-10 !px-4 text-[14px] sm:inline-flex">
              Get started
            </button>
            <button
              type="button"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-paper lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </Wrap>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.45, ease: [0.65, 0, 0.15, 1] }}
            className="h-[calc(100svh-68px)] overflow-y-auto bg-black lg:hidden"
          >
            <Wrap className="flex min-h-full flex-col pb-10 pt-6">
              <nav aria-label="Menu">
                <ul>
                  {NAV.map((n) => (
                    <li key={n.id}>
                      <a href={`#${n.id}`} onClick={go(n.id)} className="si-d flex items-center justify-between py-4 text-[30px] text-paper">
                        {n.label}
                        <ArrowUpRight className="h-5 w-5 text-steel/50" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <p className="si-jp mt-8 text-[15px] text-samurai" lang="ja">
                会話を支配する
              </p>
              <div className="mt-auto grid gap-3 pt-10">
                <button type="button" onClick={() => enterApp('signup')} className="si-btn si-btn-primary w-full">
                  Get started
                </button>
                <button type="button" onClick={() => enterApp('login')} className="si-btn si-btn-ghost w-full">
                  Log in
                </button>
              </div>
            </Wrap>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
