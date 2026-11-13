/** Signed-in workspace (interactive preview). Lazy-loaded so the marketing site stays light. */
import React from 'react';
import { MotionConfig } from 'framer-motion';
import { useApp } from './context/AppContext';
import { PricingDialog, Sidebar, Toasts, Topbar } from './app/Shell';
import { ReplyStudio } from './app/ReplyStudio';
import { Onboarding } from './app/Onboarding';
import { Overview } from './app/views/Overview';
import { Opportunities } from './app/views/Opportunities';
import { Drafts } from './app/views/Drafts';
import { Create } from './app/views/Create';
import { Inbox } from './app/views/Inbox';
import { Calendar } from './app/views/Calendar';
import { Analytics } from './app/views/Analytics';
import { Arena } from './app/views/Arena';
import { Automations, Connections, Settings } from './app/views/Setup';

const AppShell: React.FC = () => {
  const { currentView, onboardingComplete } = useApp();

  if (!onboardingComplete) return <Onboarding />;

  return (
    <MotionConfig reducedMotion="user">
      <div className="si flex min-h-screen bg-graphite text-paper">
        <a href="#workspace" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black">
          Skip to content
        </a>
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main id="workspace" className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {currentView === 'dashboard' && <Overview />}
            {currentView === 'opportunities' && <Opportunities />}
            {currentView === 'drafts' && <Drafts />}
            {currentView === 'create' && <Create />}
            {currentView === 'inbox' && <Inbox />}
            {currentView === 'calendar' && <Calendar />}
            {currentView === 'analytics' && <Analytics />}
            {currentView === 'battle' && <Arena />}
            {currentView === 'connections' && <Connections />}
            {currentView === 'automation' && <Automations />}
            {currentView === 'settings' && <Settings />}
          </main>
        </div>
        <ReplyStudio />
        <PricingDialog />
        <Toasts />
      </div>
    </MotionConfig>
  );
};

export default AppShell;
