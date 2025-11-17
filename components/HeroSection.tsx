import React from 'react';
import { Page } from '../types';
import { DottedSurface } from './ui/dotted-surface';
import AnimatedGradientBackground from './ui/animated-gradient-background';

interface HeroSectionProps {
  navigateTo: (page: Page, anchor?: string | null) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ navigateTo }) => {
  const handleAnalyzeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    if (targetId) navigateTo('home', targetId);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      <AnimatedGradientBackground
        gradientColors={["#020617", "#0ea5e9", "#22d3ee"]}
        gradientStops={[40, 55, 100]}
        startingGap={30}
        breathingRange={15}
        animationSpeed={0.015}
        topOffset={-150}
        containerClassName="opacity-50"
      />
      <DottedSurface />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-0">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight">
            Get Instant<br />
            <span className="text-gradient">Risk Analysis.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Check a suspicious text, email, or phone number, or upload a voicemail to see a quick scam risk score with actionable advice. No account needed. We don’t store your data.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href="#analyze-section"
              onClick={handleAnalyzeClick}
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold text-lg rounded-lg shadow-xl hover:from-sky-600 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
            >
              Analyze Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
