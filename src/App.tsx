import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MarketingSite } from './components/Site/MarketingSite';

const AppShell = lazy(() => import('./AppShell'));

const AppLoading: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#111111]" role="status">
    <img src="/brand/mark.webp" alt="" className="h-12 w-12 animate-pulse" />
    <span className="sr-only">Loading SocialSamurai…</span>
  </div>
);

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const inApp = currentView !== 'landing';
  const pushed = useRef(false);

  // Give the browser Back button a sensible target: app -> marketing site.
  useEffect(() => {
    if (inApp && !pushed.current) {
      window.history.pushState({ ss: 'app' }, '', window.location.pathname);
      pushed.current = true;
    }
    if (!inApp) pushed.current = false;
  }, [inApp]);

  useEffect(() => {
    const onPop = () => {
      if (pushed.current) {
        pushed.current = false;
        setCurrentView('landing');
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [setCurrentView]);

  if (currentView === 'landing') return <MarketingSite />;
  return (
    <Suspense fallback={<AppLoading />}>
      <AppShell />
    </Suspense>
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
