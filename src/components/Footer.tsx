'use client';

import React from 'react';
import Image from 'next/image';
import {
  Compass,
  Camera,
  Users,
  Feather,
  Mail,
  MapPin,
  ArrowUp,
  Heart,
  Shield,
  Trees,
} from 'lucide-react';
import { TabType } from './Header';

interface FooterProps {
  onTabChange: (tab: TabType) => void;
}

export default function Footer({ onTabChange }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (tab: TabType) => {
    onTabChange(tab);
    scrollToTop();
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#0e2717] via-[#08170d] to-[#040c07] text-white border-t-4 border-hornbill-yellow overflow-hidden">
      {/* Decorative subtle background feather watermark */}
      <div
        className="absolute right-6 -bottom-10 text-[180px] sm:text-[240px] opacity-5 pointer-events-none select-none font-serif"
        aria-hidden="true"
      >
        🪶
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-12 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="logo-frame ring-2 ring-amber-400/50 shrink-0 bg-white">
                <Image
                  src="/images/logo.svg"
                  alt="Chandigarh Birding Club Logo"
                  width={50}
                  height={50}
                  className="hornbill-icon"
                />
              </span>
              <div>
                <h3 className="font-serif text-lg font-black leading-tight text-white">
                  Chandigarh Birding Club
                </h3>
                <p className="text-[10px] text-hornbill-yellow tracking-[2px] uppercase font-semibold">
                  Into the wild, together
                </p>
              </div>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Exploring, documenting, and protecting the magnificent avifauna of Chandigarh, Sukhna Lake, and the Shivalik foothills since 2023.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-amber-300">
              <MapPin className="w-3 h-3 text-amber-300" />
              <span>30.7333° N, 76.7794° E · City Beautiful</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-hornbill-yellow mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4" /> Quick Explore
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNavClick('walks')}
                  className="flex items-center gap-2 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  🌿 Nature Walks & Field Trips
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('gallery')}
                  className="flex items-center gap-2 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  📸 Weekly Bird Gallery & Sightings
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('members')}
                  className="flex items-center gap-2 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  👥 Club Members & Naturalists
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="flex items-center gap-2 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                  🦅 About Us & Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Prime Birding Hotspots */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-hornbill-yellow mb-4 flex items-center gap-2">
              <Trees className="w-4 h-4" /> Prime Birding Hotspots
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">›</span>
                <span><strong>Sukhna Lake</strong> · Migratory Waterfowl & Waders</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">›</span>
                <span><strong>Nepli & Kansal Forests</strong> · Raptors & Canopy Birds</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">›</span>
                <span><strong>Morni Hills</strong> · Shivalik Altitudinal Species</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">›</span>
                <span><strong>Rock Garden & Leisure Valley</strong> · Urban Residents</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">›</span>
                <span><strong>Dhanas Grasslands</strong> · Francolins & Pipits</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Contact */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-hornbill-yellow mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" /> Join Our Community
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Open to beginners, veteran birdwatchers, photographers, and nature lovers of all ages.
            </p>
            <div className="space-y-2 text-xs">
              <a
                href="mailto:chandigarhbirdingclub2026@gmail.com"
                className="flex items-center gap-2 text-neutral-300 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">chandigarhbirdingclub2026@gmail.com</span>
              </a>
              <a
                href="https://www.instagram.com/Chandigarh_birdingclub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-amber-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-rose-400 shrink-0 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>@Chandigarh_birdingclub</span>
              </a>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs">
              <span className="text-neutral-400 block text-[11px]">Founder & Naturalist:</span>
              <span className="font-semibold text-white">Vartika Arora</span>{' '}
              <a
                href="mailto:vartika.arora2010@gmail.com"
                className="text-[11px] text-amber-300 hover:underline block truncate"
              >
                vartika.arora2010@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Ethical Birding Banner */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-300">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Ethical Birding Code</strong>: Keep a respectful distance, avoid call playback during breeding season, and leave no trace behind.
            </span>
          </div>
          <span className="bg-emerald-800/60 text-emerald-200 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded shrink-0">
            Conservation First
          </span>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="text-center sm:text-left">
            <p>© {new Date().getFullYear()} Chandigarh Birding Club. All rights reserved.</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Powered by Next.js, Tailwind CSS & Neon PostgreSQL.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-all text-xs font-medium cursor-pointer border border-white/10 group"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
