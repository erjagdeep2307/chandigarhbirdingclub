'use client';

import React from 'react';

export default function HornbillBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#2d2d2d] border-b-4 border-hornbill-yellow">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-5">
        <span className="bg-hornbill-yellow text-neutral-900 text-[10px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded shrink-0">
          ⭐ State Bird
        </span>
        <p className="text-white text-[13px] leading-relaxed pr-0 sm:pr-16">
          <strong className="text-hornbill-yellow font-semibold">Indian Grey Hornbill</strong>{' '}
          — Chandigarh&apos;s beloved state bird. Look out for them in Sukhna Lake, Rock Garden, and the city&apos;s magnificent fig trees. Their distinctive yellow casque is unmistakable!
        </p>
        <span
          className="hidden sm:block absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 opacity-15 text-5xl sm:text-6xl select-none pointer-events-none"
          aria-hidden="true"
        >
          🪶
        </span>
      </div>
    </div>
  );
}
