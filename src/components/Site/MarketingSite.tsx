import React from 'react';
import { MotionConfig } from 'framer-motion';
import { Header } from './Header';
import { Hero } from './Hero';
import { Manifesto, Radar, Workflow } from './Discover';
import { Approval, Arena, Faq, FinalCall, Footer, Personalities, Pricing, SpecSheet } from './Command';

/**
 * Public marketing site, rendered on the app's 'landing' view.
 * CTAs hand off to the app via `enterApp` in AppContext.
 */
export const MarketingSite: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="si min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Manifesto />
        <Radar />
        <Workflow />
        <Personalities />
        <Approval />
        <SpecSheet />
        <Arena />
        <Pricing />
        <Faq />
        <FinalCall />
      </main>
      <Footer />
    </div>
  </MotionConfig>
);
