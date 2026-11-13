import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ChartLine,
  FilePenLine,
  Inbox,
  LayoutGrid,
  Menu,
  PenSquare,
  Plug,
  Radar,
  Settings,
  Swords,
  Workflow,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { ViewTab } from '../types';
import { ART } from '../components/Site/content';
import { Btn, cx } from './ui';

type NavItem = { id: ViewTab; label: string; icon: React.ElementType; count?: number };

function useNav(): { group: string; items: NavItem[] }[] {
  const { opportunities, drafts, inbox } = useApp();
  const open = opportunities.filter((o) => o.status === 'new' || o.status === 'saved').length;
  const awaiting = drafts.filter((d) => d.status === 'awaiting').length;
  const unread = inbox.filter((i) => !i.read).length;
  return [
    {
      group: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutGrid },
        { id: 'opportunities', label: 'Opportunities', icon: Radar, count: open },
        { id: 'drafts', label: 'Drafts', icon: FilePenLine, count: awaiting },
        { id: 'create', label: 'Create post', icon: PenSquare },
        { id: 'inbox', label: 'Inbox', icon: Inbox, count: unread },
        { id: 'calendar', label: 'Calendar', icon: CalendarDays },
      ],
    },
    {
      group: 'Insight',
      items: [
        { id: 'analytics', label: 'Analytics', icon: ChartLine },
        { id: 'battle', label: 'Arena', icon: Swords },
      ],
    },
    {
      group: 'Setup',
      items: [
        { id: 'connections', label: 'Connections', icon: Plug },
        { id: 'automation', label: 'Automations', icon: Workflow },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];
}

export const TITLES: Record<ViewTab, string> = {
  landing: 'Website',
  dashboard: 'Overview',
  opportunities: 'Opportunities',
  drafts: 'Drafts',
  create: 'Create post',
  inbox: 'Inbox',
  calendar: 'Calendar',
  analytics: 'Analytics',
  battle: 'Arena',
  connections: 'Connections',
  automation: 'Automations',
  settings: 'Settings',
};

const NavList: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const { currentView, setCurrentView } = useApp();
  const groups = useNav();
  return (
    <nav aria-label="App" className="space-y-4">
      {groups.map((g) => (
        <div key={g.group}>
          <p className="px-3 pb-1.5 text-[11.5px] font-medium text-steel/65">{g.group}</p>
          <ul className="space-y-0.5">
            {g.items.map(({ id, label, icon: Icon, count }) => {
              const on = currentView === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    data-view={id}
                    aria-current={on ? 'page' : undefined}
                    onClick={() => {
                      setCurrentView(id);
                      onNavigate?.();
                    }}
                    className={cx(
                      'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[14px] transition-colors',
                      on ? 'bg-white/[0.07] text-paper' : 'text-steel/70 hover:bg-white/[0.04] hover:text-paper'
                    )}
                  >
                    {on && <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-samurai shadow-[0_0_10px_rgb(139_92_246/0.9)]" />}
                    <Icon className={cx('h-[18px] w-[18px]', on ? 'text-paper' : 'text-steel/55 group-hover:text-steel')} aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    {!!count && <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[11.5px] tabular-nums text-steel">{count}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

const SidebarFooter: React.FC = () => {
  const { credits, creditsMax, setPricingOpen, setCurrentView } = useApp();
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-charcoal p-3.5 ring-1 ring-white/[0.06]">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-steel/75">Credits today</span>
          <span className="tabular-nums text-paper">
            {credits} / {creditsMax}
          </span>
        </div>
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-samurai transition-[width] duration-500" style={{ width: `${(credits / creditsMax) * 100}%` }} />
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-steel/60">Preview credits. Earn more in the Arena.</p>
        <Btn size="sm" variant="secondary" className="mt-3 w-full" onClick={() => setPricingOpen(true)}>
          See pricing
        </Btn>
      </div>
      <button
        type="button"
        onClick={() => setCurrentView('landing')}
        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[13px] text-steel/65 hover:bg-white/[0.04] hover:text-paper"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to website
      </button>
    </div>
  );
};

const Brand: React.FC = () => {
  const { setCurrentView } = useApp();
  return (
    <button type="button" onClick={() => setCurrentView('dashboard')} aria-label="SocialSamurai overview" className="flex items-center">
      <img src={ART.logo} alt="SocialSamurai" width={323} height={96} className="h-8 w-auto" />
    </button>
  );
};

export const Sidebar: React.FC = () => (
  <aside className="sticky top-0 hidden h-screen w-[256px] shrink-0 flex-col border-r border-white/[0.07] bg-black px-4 py-5 lg:flex">
    <div className="px-2">
      <Brand />
    </div>
    <div className="mt-6 flex-1 overflow-y-auto pr-1">
      <NavList />
    </div>
    <div className="pt-4">
      <SidebarFooter />
    </div>
  </aside>
);

const Notifications: React.FC = () => {
  const { notifications, markAllNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-steel/80 ring-1 ring-white/10 hover:text-paper hover:ring-white/25"
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-samurai shadow-[0_0_8px_rgb(139_92_246)]" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-12 z-50 w-[min(92vw,360px)] rounded-2xl bg-charcoal p-2 shadow-2xl ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-[14px] font-semibold text-paper">Notifications</p>
              <button type="button" onClick={markAllNotificationsRead} className="text-[12.5px] text-steel/70 hover:text-paper">
                Mark all read
              </button>
            </div>
            <ul className="max-h-[360px] overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className="rounded-xl px-3 py-3 hover:bg-white/[0.04]">
                  <div className="flex items-start gap-3">
                    <span className={cx('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-samurai')} />
                    <div>
                      <p className="text-[13.5px] font-medium text-paper">{n.title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-steel/70">{n.message}</p>
                      <p className="mt-1 text-[12px] text-steel/50">{n.age}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Topbar: React.FC = () => {
  const { currentView, profile, setCurrentView } = useApp();
  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    window.addEventListener('keydown', esc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', esc);
    };
  }, [drawer]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-graphite/85 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full text-paper lg:hidden"
            aria-label="Open navigation"
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="text-[15px] font-medium text-paper">{TITLES[currentView]}</p>
          <span className="hidden items-center gap-2 rounded-full px-3 py-1 text-[12.5px] text-steel/75 ring-1 ring-white/12 sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-samurai" />
            Preview · sample data
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Notifications />
            <button
              type="button"
              onClick={() => setCurrentView('settings')}
              aria-label={`Settings for ${profile.name}`}
              className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/15 hover:ring-samurai/60"
            >
              <img src={ART.helm} alt="" className="h-full w-full object-cover" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {drawer && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/70" onClick={() => setDrawer(false)} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.65, 0, 0.15, 1] }}
              className="absolute inset-y-0 left-0 flex w-[86vw] max-w-[320px] flex-col bg-black px-4 py-5 ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between px-2">
                <Brand />
                <button type="button" aria-label="Close navigation" onClick={() => setDrawer(false)} className="flex h-10 w-10 items-center justify-center text-paper">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-6 flex-1 overflow-y-auto">
                <NavList onNavigate={() => setDrawer(false)} />
              </div>
              <div className="pt-4">
                <SidebarFooter />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Toasts: React.FC = () => {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 flex-col items-center gap-2" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-full bg-white px-4 py-2.5 text-[13.5px] font-medium text-black shadow-xl"
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Dialog primitive + pricing                                          */
/* ------------------------------------------------------------------ */

export const Dialog: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }> = ({
  open,
  onClose,
  title,
  children,
  wide,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => ref.current?.querySelector<HTMLElement>('button, textarea, input')?.focus(), 30);
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.65, 0, 0.15, 1] }}
            className={cx(
              'relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl bg-charcoal p-6 ring-1 ring-white/10 sm:rounded-3xl sm:p-8',
              wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'
            )}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 className="si-d-med text-[22px] text-paper">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 -mt-1 flex h-9 w-9 items-center justify-center rounded-full text-steel/70 hover:bg-white/[0.06] hover:text-paper">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PricingDialog: React.FC = () => {
  const { pricingOpen, setPricingOpen } = useApp();
  return (
    <Dialog open={pricingOpen} onClose={() => setPricingOpen(false)} title="Pricing">
      <p className="text-[14.5px] leading-relaxed text-steel/75">
        SocialSamurai isn’t on sale yet. This is the proposed launch pricing — plan details and credit allowances will be confirmed before launch.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-5 ring-1 ring-white/12">
          <p className="text-[13px] text-steel/70">Monthly</p>
          <p className="si-d mt-2 text-[34px] text-paper">$19</p>
          <p className="text-[13px] text-steel/60">per month</p>
        </div>
        <div className="rounded-2xl bg-white p-5 text-black">
          <p className="text-[13px] text-black/60">Yearly · save 39%</p>
          <p className="si-d mt-2 text-[34px]">$140</p>
          <p className="text-[13px] text-black/60">per year</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Btn variant="primary" onClick={() => setPricingOpen(false)}>
          Got it
        </Btn>
      </div>
    </Dialog>
  );
};
