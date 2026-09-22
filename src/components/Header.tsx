'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import {
  Menu,
  X,
  Compass,
  Camera,
  Users,
  Feather,
  ChevronRight,
} from 'lucide-react';

export type TabType = 'walks' | 'gallery' | 'members' | 'about';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems: {
    id: TabType;
    label: string;
    icon: React.ReactNode;
    tag: string;
  }[] = [
    {
      id: 'walks',
      label: 'Nature Walks',
      icon: <Compass className="w-5 h-5 shrink-0" />,
      tag: '🌿 Nature Walks',
    },
    {
      id: 'gallery',
      label: 'Bird Gallery',
      icon: <Camera className="w-5 h-5 shrink-0" />,
      tag: '📸 Bird Gallery',
    },
    {
      id: 'members',
      label: 'Members',
      icon: <Users className="w-5 h-5 shrink-0" />,
      tag: '👥 Members',
    },
    {
      id: 'about',
      label: 'About Club',
      icon: <Feather className="w-5 h-5 shrink-0" />,
      tag: '🦅 About',
    },
  ];

  const handleSelectTab = (tab: TabType) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-br from-[#0d3d1f] via-[#1B7A4A] to-[#0d3d1f] shadow-[0_2px_20px_rgba(0,0,0,0.25)] border-b border-emerald-900/40 w-full">
        <div className="max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          {/* Logo and Club Name */}
          <div className="flex items-center gap-3">
            <span className="logo-frame ring-2 ring-amber-400/40 shrink-0 bg-white">
              <Image
                src="/images/logo.svg"
                alt="Chandigarh Birding Club logo"
                width={54}
                height={54}
                priority
                className="hornbill-icon"
              />
            </span>
            <div className="text-white text-left">
              <h1 className="font-serif text-lg sm:text-[22px] font-black leading-tight tracking-tight">
                Chandigarh Birding Club
              </h1>
              <p className="hidden sm:block text-[11px] text-hornbill-yellow tracking-[2px] uppercase font-medium mt-0.5">
                Into the wild, together
              </p>
            </div>
          </div>

          {/* Desktop Navigation (visible on extra large screens 1280px+) */}
          <div className="hidden xl:flex items-center gap-3">
            <nav className="flex gap-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-hornbill-yellow text-hornbill-black font-semibold shadow-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.tag}
                  </button>
                );
              })}
            </nav>
            <div className="pl-2 border-l border-white/20">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile & Tablet Right Controls: Theme Toggle & Prominent Menu Toggler Button */}
          <div className="flex xl:hidden items-center gap-2">
            <ThemeToggle />

            {/* Visual, stunning, and unmistakable Menu Toggler Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-hornbill-yellow text-hornbill-black hover:bg-amber-400 active:scale-95 transition-all cursor-pointer shadow-md font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Menu className="w-5 h-5 text-neutral-900" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Height Mobile & Tablet Navigation Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 xl:hidden bg-[#0a2012] dark:bg-[#051109] text-white flex flex-col h-screen w-screen overflow-y-auto animate-fade-in"
        >
          {/* Top Bar: Only Logo (no helping text) and Close Toggler Button */}
          <div className="w-full px-5 py-4 flex items-center justify-between border-b border-white/15 bg-black/25 shrink-0">
            <div className="logo-frame ring-2 ring-amber-400/50 bg-white">
              <Image
                src="/images/logo.svg"
                alt="Chandigarh Birding Club"
                width={46}
                height={46}
                className="hornbill-icon"
              />
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 text-white border border-white/20 transition-all cursor-pointer text-xs font-bold uppercase tracking-wider"
            >
              <span>Close</span>
              <X className="w-4 h-4 text-amber-300" />
            </button>
          </div>

          {/* Full-Height Menu Body with Navigation Icons & Clean Labels */}
          <div className="flex-1 p-5 flex flex-col justify-center max-w-md mx-auto w-full space-y-3.5">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-hornbill-yellow mb-1 px-1">
              Explore Sections
            </p>

            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-hornbill-yellow to-amber-400 text-neutral-900 font-extrabold shadow-lg scale-[1.02]'
                      : 'bg-white/5 hover:bg-white/10 active:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isActive
                          ? 'bg-neutral-900/15 text-neutral-900'
                          : 'bg-black/35 text-amber-300'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-base sm:text-lg font-bold">
                      {item.tag}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      isActive ? 'text-neutral-900 translate-x-1' : 'text-white/40'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Bottom Bar inside Full Height Menu */}
          <div className="p-5 border-t border-white/15 bg-black/30 shrink-0 flex items-center justify-between text-xs text-white/70">
            <span className="text-[11px] text-neutral-300 font-medium">
              Chandigarh Birding Club · 2026
            </span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
}
