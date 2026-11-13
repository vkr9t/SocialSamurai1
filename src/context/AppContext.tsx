import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ViewTab,
  SocialAccount,
  Opportunity,
  ScheduledPost,
  InboxItem,
  AIPreferenceRule,
  UserSubscription,
  UserUsageLimits,
  NotificationItem,
  PlatformType,
} from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_SCHEDULED,
  INITIAL_INBOX,
  INITIAL_PREFERENCES,
  INITIAL_SUBSCRIPTION,
  INITIAL_LIMITS,
  INITIAL_NOTIFICATIONS,
  MOCK_KEYWORDS,
} from '../data/mockData';
import { sounds } from '../utils/audio';

interface AppContextType {
  currentView: ViewTab;
  setCurrentView: (tab: ViewTab) => void;
  subscription: UserSubscription;
  usageLimits: UserUsageLimits;
  accounts: SocialAccount[];
  opportunities: Opportunity[];
  scheduledPosts: ScheduledPost[];
  inbox: InboxItem[];
  preferences: AIPreferenceRule[];
  notifications: NotificationItem[];
  keywords: string[];
  demoMode: boolean;
  onboardingComplete: boolean;

  // Modals & Drawers
  activeReplyModal: Opportunity | null;
  setActiveReplyModal: (opp: Opportunity | null) => void;
  activeUpgradeModal: boolean;
  setActiveUpgradeModal: (open: boolean) => void;
  activeSuccessModal: boolean;
  setActiveSuccessModal: (open: boolean) => void;
  activeScanningModal: boolean;
  setActiveScanningModal: (open: boolean) => void;
  activeOAuthModal: SocialAccount | null;
  setActiveOAuthModal: (acc: SocialAccount | null) => void;

  // Actions
  scanForOpportunities: () => void;
  approveAndPublishReply: (oppId: string, replyText: string) => boolean;
  dismissOpportunity: (oppId: string) => void;
  saveOpportunity: (oppId: string) => void;
  scheduleNewPost: (post: Omit<ScheduledPost, 'id'>) => boolean;
  upgradeSubscription: (billingCycle: 'monthly' | 'yearly') => void;
  earnGameCredits: (score: number) => number;
  useUserCredits: (amount: number) => boolean;
  toggleConnectPlatform: (platform: PlatformType) => void;
  addKeyword: (kw: string) => void;
  removeKeyword: (kw: string) => void;
  markNotificationRead: (id: string) => void;
  finishOnboarding: (goals: string[], keywords: string[]) => void;
  toggleDemoMode: () => void;
  /** Entry point from the marketing site into the app prototype. */
  enterApp: (destination: AppEntry) => void;
}

export type AppEntry = 'signup' | 'login' | 'demo' | 'arena';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentViewTab] = useState<ViewTab>('landing');
  const [subscription, setSubscription] = useState<UserSubscription>(INITIAL_SUBSCRIPTION);
  const [usageLimits, setUsageLimits] = useState<UserUsageLimits>(INITIAL_LIMITS);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_ACCOUNTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED);
  const [inbox, setInbox] = useState<InboxItem[]>(INITIAL_INBOX);
  const [preferences] = useState<AIPreferenceRule[]>(INITIAL_PREFERENCES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [keywords, setKeywords] = useState<string[]>(MOCK_KEYWORDS);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(true);

  // Modals
  const [activeReplyModal, setActiveReplyModal] = useState<Opportunity | null>(null);
  const [activeUpgradeModal, setActiveUpgradeModal] = useState<boolean>(false);
  const [activeSuccessModal, setActiveSuccessModal] = useState<boolean>(false);
  const [activeScanningModal, setActiveScanningModal] = useState<boolean>(false);
  const [activeOAuthModal, setActiveOAuthModal] = useState<SocialAccount | null>(null);

  const setCurrentView = (tab: ViewTab) => {
    sounds.playClick();
    setCurrentViewTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const useUserCredits = (amount: number): boolean => {
    if (subscription.plan === 'samurai') return true; // Unlimited for Samurai
    if (usageLimits.dailyCreditsCount < amount) {
      sounds.playBlock();
      setActiveUpgradeModal(true);
      return false;
    }
    setUsageLimits((prev) => ({
      ...prev,
      dailyCreditsCount: prev.dailyCreditsCount - amount,
    }));
    return true;
  };

  const scanForOpportunities = () => {
    sounds.playScanBeep();
    setActiveScanningModal(true);
  };

  const approveAndPublishReply = (oppId: string, replyText: string): boolean => {
    if (subscription.plan === 'free' && usageLimits.monthlyRepliesCount >= usageLimits.monthlyRepliesMax) {
      setActiveUpgradeModal(true);
      return false;
    }

    if (!useUserCredits(5)) {
      return false;
    }

    sounds.playVictory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9333EA', '#FFFFFF', '#C084FC', '#7E22CE'],
    });

    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, replied: true } : o))
    );

    setUsageLimits((prev) => ({
      ...prev,
      monthlyRepliesCount: prev.monthlyRepliesCount + 1,
    }));

    // Add push notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: '⚔️ Clean Strike Published!',
      message: `Your reply was approved & queued for publishing.`,
      type: 'published',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return true;
  };

  const dismissOpportunity = (oppId: string) => {
    sounds.playClick();
    setOpportunities((prev) => prev.map((o) => (o.id === oppId ? { ...o, dismissed: true } : o)));
  };

  const saveOpportunity = (oppId: string) => {
    sounds.playClick();
    setOpportunities((prev) =>
      prev.map((o) => (o.id === oppId ? { ...o, saved: !o.saved } : o))
    );
  };

  const scheduleNewPost = (post: Omit<ScheduledPost, 'id'>): boolean => {
    if (subscription.plan === 'free' && scheduledPosts.length >= 3) {
      setActiveUpgradeModal(true);
      return false;
    }

    sounds.playClick();
    const newPost: ScheduledPost = {
      ...post,
      id: `sch_${Date.now()}`,
    };
    setScheduledPosts((prev) => [newPost, ...prev]);
    return true;
  };

  const earnGameCredits = (score: number): number => {
    let earned = 2;
    if (score > 800) earned = 10;
    else if (score > 500) earned = 8;
    else if (score > 200) earned = 5;

    const remainingToCap = Math.max(0, usageLimits.dailyCreditsMax - usageLimits.dailyCreditsCount);
    const actualAdded = Math.min(earned, remainingToCap);

    if (actualAdded > 0) {
      setUsageLimits((prev) => ({
        ...prev,
        dailyCreditsCount: prev.dailyCreditsCount + actualAdded,
      }));
    }
    return actualAdded;
  };

  const upgradeSubscription = (billingCycle: 'monthly' | 'yearly') => {
    sounds.playVictory();
    setSubscription({
      plan: 'samurai',
      billingCycle,
      renewsAt: '2027-08-16T00:00:00Z',
      entitlement: 'samurai_pro',
    });
    setUsageLimits((prev) => ({
      ...prev,
      dailyOpportunitiesMax: 25,
      monthlyRepliesMax: 9999,
      monthlyPostsMax: 9999,
      dailyCreditsMax: 50,
      dailyCreditsCount: 50,
    }));
    setActiveUpgradeModal(false);
    setActiveSuccessModal(true);

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#E3262E', '#FFFFFF', '#FFD700'],
    });
  };

  const toggleConnectPlatform = (platform: PlatformType) => {
    const acc = accounts.find((a) => a.platform === platform);
    if (!acc) return;
    if (acc.connected) {
      // Disconnect
      sounds.playClick();
      setAccounts((prev) =>
        prev.map((a) => (a.platform === platform ? { ...a, connected: false } : a))
      );
    } else {
      // Open OAuth Modal simulation
      setActiveOAuthModal(acc);
    }
  };

  const addKeyword = (kw: string) => {
    if (!kw.trim() || keywords.includes(kw.trim())) return;
    sounds.playClick();
    setKeywords((prev) => [...prev, kw.trim()]);
  };

  const removeKeyword = (kw: string) => {
    sounds.playClick();
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const finishOnboarding = (goals: string[], newKws: string[]) => {
    if (newKws.length > 0) setKeywords(newKws);
    setOnboardingComplete(true);
    setCurrentView('dashboard');
  };

  const enterApp = (destination: AppEntry) => {
    if (destination === 'signup') {
      // New users start with onboarding (choose a Samurai, set up the brand).
      setOnboardingComplete(false);
      setCurrentView('dashboard');
      return;
    }
    setOnboardingComplete(true);
    if (destination === 'demo') setDemoMode(true);
    setCurrentView(destination === 'arena' ? 'battle' : 'dashboard');
  };

  const toggleDemoMode = () => {
    setDemoMode(!demoMode);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        subscription,
        usageLimits,
        accounts,
        opportunities,
        scheduledPosts,
        inbox,
        preferences,
        notifications,
        keywords,
        demoMode,
        onboardingComplete,
        activeReplyModal,
        setActiveReplyModal,
        activeUpgradeModal,
        setActiveUpgradeModal,
        activeSuccessModal,
        setActiveSuccessModal,
        activeScanningModal,
        setActiveScanningModal,
        activeOAuthModal,
        setActiveOAuthModal,
        scanForOpportunities,
        approveAndPublishReply,
        dismissOpportunity,
        saveOpportunity,
        scheduleNewPost,
        upgradeSubscription,
        earnGameCredits,
        useUserCredits,
        toggleConnectPlatform,
        addKeyword,
        removeKeyword,
        markNotificationRead,
        finishOnboarding,
        toggleDemoMode,
        enterApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
