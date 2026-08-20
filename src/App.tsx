import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { MobileNav } from './components/Layout/MobileNav';

// Views
import { LandingHeroView } from './components/Landing/LandingHeroView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { OpportunitiesView } from './components/Opportunities/OpportunitiesView';
import { CreateView } from './components/Composer/CreateView';
import { InboxView } from './components/Inbox/InboxView';
import { CalendarView } from './components/Calendar/CalendarView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { BattleView } from './components/Battle/BattleView';
import { ConnectionsView } from './components/Connections/ConnectionsView';
import { AutomationView } from './components/Automation/AutomationView';
import { SettingsView } from './components/Settings/SettingsView';

// Modals & Onboarding
import { WelcomeModal } from './components/Onboarding/WelcomeModal';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { ReplyModal } from './components/Composer/ReplyModal';
import { ScanningModal } from './components/Opportunities/ScanningModal';
import { OAuthModal } from './components/Connections/OAuthModal';
import { PricingModal } from './components/Subscription/PricingModal';
import { SuccessModal } from './components/Subscription/SuccessModal';

const AppContent: React.FC = () => {
  const { currentView, onboardingComplete } = useApp();
  const [showOnboardingFlow, setShowOnboardingFlow] = useState<boolean>(false);

  // If user is on the Landing / Pitch Hero Page
  if (currentView === 'landing') {
    return (
      <>
        <LandingHeroView />
        <ReplyModal />
        <ScanningModal />
        <OAuthModal />
        <PricingModal />
        <SuccessModal />
      </>
    );
  }

  // If onboarding not completed yet
  if (!onboardingComplete) {
    if (showOnboardingFlow) {
      return <OnboardingFlow />;
    }
    return <WelcomeModal onStartOnboarding={() => setShowOnboardingFlow(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#08080C] text-[#F5F5F5] font-sans flex flex-col md:flex-row antialiased selection:bg-[#9333EA] selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'opportunities' && <OpportunitiesView />}
          {currentView === 'create' && <CreateView />}
          {currentView === 'inbox' && <InboxView />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'battle' && <BattleView />}
          {currentView === 'connections' && <ConnectionsView />}
          {currentView === 'automation' && <AutomationView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Modals */}
      <ReplyModal />
      <ScanningModal />
      <OAuthModal />
      <PricingModal />
      <SuccessModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

