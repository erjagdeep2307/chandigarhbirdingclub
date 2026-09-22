'use client';

import React from 'react';

export default function AboutTab() {
  const features = [
    {
      icon: '🌅',
      title: 'Regular Dawn Walks',
      desc: 'Weekly early-morning outings to prime birding spots around the city and Shivalik range.',
    },
    {
      icon: '📔',
      title: 'Bird Census',
      desc: 'Participate in seasonal bird counts and contribute to national databases like eBird India.',
    },
    {
      icon: '🔭',
      title: 'Optics Sharing',
      desc: 'Binoculars and spotting scopes available for new members during club walks.',
    },
    {
      icon: '🌿',
      title: 'Conservation',
      desc: 'We work with local authorities to protect nesting sites and habitats across Chandigarh.',
    },
    {
      icon: '📸',
      title: 'Photography Mentoring',
      desc: 'Experienced bird photographers guide beginners in ethical wildlife photography.',
    },
    {
      icon: '🏫',
      title: 'School Outreach',
      desc: 'We visit schools to spark curiosity about birds and nature in the next generation.',
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0d3d1f] to-[#1B7A4A] rounded-[20px] p-8 sm:p-10 text-white mb-8 shadow-md">
        <h2 className="font-serif text-2xl sm:text-[32px] font-black mb-3.5 leading-tight">
          About the Chandigarh Birding Club
        </h2>
        <p className="text-sm sm:text-[15px] leading-relaxed opacity-90 max-w-[600px]">
          We are a community of passionate birdwatchers exploring the rich avifauna of Chandigarh and the Shivalik foothills. From the wetlands of Sukhna Lake to the dense canopies of the Morni Hills, we document, protect, and celebrate every feathered encounter.
        </p>
        <span
          className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 text-8xl sm:text-[120px] opacity-15 pointer-events-none select-none"
          aria-hidden="true"
        >
          🦅
        </span>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white dark:bg-surface-dark border border-borderLight dark:border-borderDark rounded-xl p-5 transition-all hover:shadow-sm"
          >
            <div className="text-2xl sm:text-[28px] mb-2.5 select-none">{f.icon}</div>
            <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5">
              {f.title}
            </h3>
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="bg-peacock-light dark:bg-[#0b1c2e] border border-[#c0d8f5] dark:border-[#1a385c] rounded-[14px] p-6 text-peacock dark:text-sky-300">
        <h3 className="font-serif text-lg font-bold mb-3.5 text-peacock dark:text-sky-200">
          🌐 Get in Touch
        </h3>
        <div className="flex flex-wrap gap-6 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <span>📧</span>
            <a
              href="mailto:chandigarhbirdingclub2026@gmail.com"
              className="hover:underline font-medium"
            >
              chandigarhbirdingclub2026@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>📸</span>
            <a
              href="https://www.instagram.com/Chandigarh_birdingclub"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium"
            >
              @Chandigarh_birdingclub
            </a>
          </div>
        </div>

        {/* Founder Card */}
        <div className="pt-4 border-t border-[#c0d8f5] dark:border-[#1a385c]">
          <p className="text-xs font-bold tracking-[1.5px] uppercase text-neutral-500 dark:text-neutral-400 mb-3">
            Founder
          </p>
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1B7A4A] to-[#2ECC71] flex items-center justify-center font-serif text-[17px] font-bold text-white shrink-0 shadow-sm select-none">
              VA
            </div>
            <div>
              <div className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
                Vartika Arora
              </div>
              <a
                href="mailto:vartika.arora2010@gmail.com"
                className="text-[13px] text-peacock dark:text-sky-400 hover:underline"
              >
                vartika.arora2010@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
