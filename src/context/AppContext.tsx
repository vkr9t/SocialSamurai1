import React, { createContext, useContext, useState } from 'react';
import type {
  AutomationRule,
  BrandProfile,
  Draft,
  InboxItem,
  NotificationItem,
  Opportunity,
  PlatformType,
  ReplyTone,
  ScheduledPost,
  SocialAccount,
  ViewTab,
} from '../types';
import {
  CREDITS,
  INITIAL_ACCOUNTS,
  INITIAL_DRAFTS,
  INITIAL_INBOX,
  INITIAL_KEYWORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_PROFILE,
  INITIAL_RULES,
  INITIAL_SCHEDULED,
} from '../data/mockData';

export type AppEntry = 'signup' | 'login' | 'demo' | 'arena';

export type Toast = { id: number; text: string };

interface AppContextType {
  currentView: ViewTab;
  setCurrentView: (tab: ViewTab) => void;
  onboardingComplete: boolean;
  enterApp: (destination: AppEntry) => void;
  finishOnboarding: (patch: Partial<BrandProfile>, keywords: string[]) => void;

  profile: BrandProfile;
  updateProfile: (patch: Partial<BrandProfile>) => void;
  keywords: string[];
  addKeyword: (k: string) => void;
  removeKeyword: (k: string) => void;

  accounts: SocialAccount[];
  connectAccount: (p: PlatformType) => void;
  disconnectAccount: (p: PlatformType) => void;
  anyConnected: boolean;

  opportunities: Opportunity[];
  setOpportunityStatus: (id: string, status: Opportunity['status']) => void;
  refreshOpportunities: () => void;

  drafts: Draft[];
  studioFor: string | null;
  openStudio: (opportunityId: string) => void;
  closeStudio: () => void;
  saveDraft: (opportunityId: string, tone: ReplyTone, text: string) => void;
  approveDraft: (opportunityId: string, tone: ReplyTone, text: string) => void;
  discardDraft: (opportunityId: string) => void;

  scheduled: ScheduledPost[];
  schedulePost: (p: Omit<ScheduledPost, 'id'>) => void;
  removePost: (id: string) => void;

  inbox: InboxItem[];
  markRead: (id: string) => void;

  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;

  rules: AutomationRule[];
  toggleRule: (id: string) => void;

  credits: number;
  creditsMax: number;
  earnCredits: (score: number) => number;

  pricingOpen: boolean;
  setPricingOpen: (v: boolean) => void;

  toasts: Toast[];
  toast: (text: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const nowLabel = () => new Date().toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setView] = useState<ViewTab>('landing');
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [profile, setProfile] = useState<BrandProfile>(INITIAL_PROFILE);
  const [keywords, setKeywords] = useState<string[]>(INITIAL_KEYWORDS);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [drafts, setDrafts] = useState<Draft[]>(INITIAL_DRAFTS);
  const [studioFor, setStudioFor] = useState<string | null>(null);
  const [scheduled, setScheduled] = useState<ScheduledPost[]>(INITIAL_SCHEDULED);
  const [inbox, setInbox] = useState<InboxItem[]>(INITIAL_INBOX);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [credits, setCredits] = useState(CREDITS.start);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  };

  const notify = (title: string, message: string) =>
    setNotifications((n) => [{ id: `n${Date.now()}`, title, message, age: nowLabel(), read: false }, ...n]);

  const setCurrentView = (tab: ViewTab) => {
    setView(tab);
    window.scrollTo({ top: 0 });
  };

  const enterApp = (destination: AppEntry) => {
    setOnboardingComplete(destination !== 'signup');
    setView(destination === 'arena' ? 'battle' : 'dashboard');
    window.scrollTo({ top: 0 });
  };

  const finishOnboarding = (patch: Partial<BrandProfile>, kws: string[]) => {
    setProfile((p) => ({ ...p, ...patch }));
    if (kws.length) setKeywords(kws);
    setOnboardingComplete(true);
    setCurrentView('dashboard');
  };

  const anyConnected = accounts.some((a) => a.connected);
  const platformName = (p: PlatformType) => (p === 'x' ? 'X' : 'Reddit');

  const upsertDraft = (opportunityId: string, tone: ReplyTone, text: string, status: Draft['status']) => {
    setDrafts((ds) => {
      const rest = ds.filter((d) => d.opportunityId !== opportunityId);
      return [{ id: `d_${opportunityId}`, opportunityId, tone, text, status, updatedAt: nowLabel() }, ...rest];
    });
  };

  const value: AppContextType = {
    currentView,
    setCurrentView,
    onboardingComplete,
    enterApp,
    finishOnboarding,

    profile,
    updateProfile: (patch) => setProfile((p) => ({ ...p, ...patch })),
    keywords,
    addKeyword: (k) => {
      const v = k.trim();
      if (v && !keywords.includes(v)) setKeywords((ks) => [...ks, v]);
    },
    removeKeyword: (k) => setKeywords((ks) => ks.filter((x) => x !== k)),

    accounts,
    anyConnected,
    connectAccount: (p) => {
      setAccounts((as) => as.map((a) => (a.platform === p ? { ...a, connected: true, handle: p === 'x' ? '@socialsamurai' : 'u/socialsamurai' } : a)));
      toast(`${platformName(p)} connected (simulated)`);
    },
    disconnectAccount: (p) => {
      setAccounts((as) => as.map((a) => (a.platform === p ? { ...a, connected: false, handle: undefined } : a)));
      toast(`${platformName(p)} disconnected`);
    },

    opportunities,
    setOpportunityStatus: (id, status) => setOpportunities((os) => os.map((o) => (o.id === id ? { ...o, status } : o))),
    refreshOpportunities: () => {
      setOpportunities((os) => os.map((o) => (o.status === 'dismissed' ? { ...o, status: 'new' } : o)));
      toast('Sample opportunities refreshed');
    },

    drafts,
    studioFor,
    openStudio: (id) => setStudioFor(id),
    closeStudio: () => setStudioFor(null),
    saveDraft: (id, tone, text) => {
      upsertDraft(id, tone, text, 'awaiting');
      setOpportunities((os) => os.map((o) => (o.id === id && o.status !== 'approved' ? { ...o, status: 'drafted' } : o)));
      toast('Draft saved');
    },
    approveDraft: (id, tone, text) => {
      upsertDraft(id, tone, text, 'approved');
      setOpportunities((os) => os.map((o) => (o.id === id ? { ...o, status: 'approved' } : o)));
      const msg = anyConnected
        ? 'Approved. In the preview, publishing is simulated — nothing was posted.'
        : 'Approved. Connect X or Reddit to publish once live connections launch.';
      toast('Reply approved');
      notify('Reply approved', msg);
    },
    discardDraft: (id) => {
      setDrafts((ds) => ds.filter((d) => d.opportunityId !== id));
      setOpportunities((os) => os.map((o) => (o.id === id ? { ...o, status: 'new' } : o)));
      toast('Draft discarded');
    },

    scheduled,
    schedulePost: (p) => {
      setScheduled((s) => [...s, { ...p, id: `s${Date.now()}` }].sort((a, b) => a.when.localeCompare(b.when)));
      toast(p.status === 'draft' ? 'Saved to drafts' : 'Post scheduled');
    },
    removePost: (id) => {
      setScheduled((s) => s.filter((x) => x.id !== id));
      toast('Post removed');
    },

    inbox,
    markRead: (id) => setInbox((i) => i.map((x) => (x.id === id ? { ...x, read: true } : x))),

    notifications,
    markAllNotificationsRead: () => setNotifications((n) => n.map((x) => ({ ...x, read: true }))),

    rules,
    toggleRule: (id) => setRules((r) => r.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x))),

    credits,
    creditsMax: CREDITS.max,
    earnCredits: (score) => {
      const earned = score > 800 ? 4 : score > 400 ? 3 : score > 150 ? 2 : 1;
      const added = Math.min(earned, CREDITS.max - credits);
      if (added > 0) setCredits((c) => c + added);
      return added;
    },

    pricingOpen,
    setPricingOpen,

    toasts,
    toast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
