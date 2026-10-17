'use client';

import React from 'react';
import { ArrowDown, Camera } from 'lucide-react';
import { TabType } from '@/components/Header';

interface HeroSectionProps {
  onTabChange: (tab: TabType) => void;
}

export default function HeroSection({ onTabChange }: HeroSectionProps) {
  const navigateTo = (tab: TabType) => {
    onTabChange(tab);
    const content = document.getElementById('club-content');
    if (!content) return;

    const top = content.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[430px] items-center overflow-hidden bg-[#13251b] bg-cover bg-center sm:min-h-[510px]"
      style={{ backgroundImage: "linear-gradient(90deg, rgba(5, 22, 14, 0.84) 0%, rgba(5, 22, 14, 0.58) 48%, rgba(5, 22, 14, 0.18) 100%), url('/images/bg.webp')" }}
    >
      <div className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl text-white">
          <p className="mb-4 text-xs font-bold uppercase tracking-[3px] text-amber-300 sm:text-sm">
            Chandigarh Birding Club
          </p>
          <h1 id="hero-title" className="font-serif text-4xl font-bold leading-[1.08] sm:text-6xl sm:leading-[1.05]">
            Into the wild,<br /> together.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/85 sm:text-lg sm:leading-7">
            Discover the birds, wetlands, and forest trails of Chandigarh with a community that loves being outdoors.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigateTo('walks')}
              className="inline-flex items-center gap-2 rounded-lg bg-hornbill-yellow px-5 py-3 text-sm font-bold text-neutral-900 transition-colors hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#13251b]"
            >
              Explore nature walks <ArrowDown size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('gallery')}
              className="inline-flex items-center gap-2 rounded-lg border border-white/70 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Camera size={16} aria-hidden="true" /> Bird gallery
            </button>
          </div>
        </div>
      </div>
      <span className="pointer-events-none absolute bottom-6 right-6 hidden text-xs font-medium uppercase tracking-[2px] text-white/65 sm:block">
        Explore · Observe · Protect
      </span>
    </section>
  );
}
