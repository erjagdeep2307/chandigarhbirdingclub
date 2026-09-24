'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BirdSighting } from '@/lib/types';
import { useToast } from '@/components/ToastContext';
import { csrfHeaders } from '@/lib/csrf';

interface BirdGalleryTabProps {
  birds: BirdSighting[];
  isAdmin: boolean;
  onRefresh: () => void;
}

export default function BirdGalleryTab({
  birds,
  isAdmin,
  onRefresh,
}: BirdGalleryTabProps) {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [latin, setLatin] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState('');
  const [emoji, setEmoji] = useState('🐦');
  const [spotter, setSpotter] = useState('');
  const [week, setWeek] = useState('This week');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add sighting via API
  const handleAddSighting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      showToast('Please fill in Bird Name and Location.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/birds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
        body: JSON.stringify({
          name: name.trim(),
          latin: latin.trim(),
          location: location.trim(),
          photo: photo.trim(),
          emoji: emoji.trim() || '🐦',
          spotter: spotter.trim() || 'Anonymous',
          week: week.trim() || 'This week',
        }),
      });

      if (res.ok) {
        setName('');
        setLatin('');
        setLocation('');
        setPhoto('');
        setEmoji('🐦');
        setSpotter('');
        setWeek('This week');
        onRefresh();
        showToast('Bird sighting added.', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to add bird sighting.', 'error');
      }
    } catch {
      showToast('Connection error while adding sighting.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete sighting via API
  const handleDeleteBird = async (id: number | string) => {
    if (!confirm('Remove this sighting?')) return;
    try {
      const res = await fetch(`/api/birds/${id}`, { method: 'DELETE', headers: csrfHeaders() });
      if (res.ok) {
        onRefresh();
        showToast('Bird sighting removed.', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to remove bird sighting.', 'error');
      }
    } catch {
      showToast('Connection error while removing sighting.', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-[28px] font-bold text-jade dark:text-emerald-400">
            📸 Bird Gallery
          </h2>
          <p className="text-[14px] text-neutral-500 dark:text-neutral-400 mt-1.5">
            Weekly sightings spotted by our members
          </p>
        </div>
      </div>

      {/* Admin Panel: Add Sighting */}
      {isAdmin && (
        <div className="bg-white dark:bg-surface-dark border-2 border-dashed border-peacock rounded-club p-6 mb-7 shadow-sm">
          <h3 className="text-[15px] font-semibold text-peacock dark:text-sky-400 mb-4">
            🐦 Add a New Bird Sighting
          </h3>
          <form onSubmit={handleAddSighting}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Bird Name (Common)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Indian Roller"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Scientific Name
                </label>
                <input
                  type="text"
                  value={latin}
                  onChange={(e) => setLatin(e.target.value)}
                  placeholder="e.g. Coracias benghalensis"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Spotted At
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sukhna Lake"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Photo URL (optional)
                </label>
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Emoji Icon (if no photo)
                </label>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  maxLength={4}
                  placeholder="🦅"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Spotted By
                </label>
                <input
                  type="text"
                  value={spotter}
                  onChange={(e) => setSpotter(e.target.value)}
                  placeholder="Member name"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                Week Label
              </label>
              <input
                type="text"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                placeholder="e.g. This week, Last week"
                className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-peacock hover:bg-[#004788] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Adding via API...' : '📸 Add to Gallery'}
            </button>
          </form>
        </div>
      )}

      {/* Bird Gallery Grid */}
      {birds.length === 0 ? (
        <div className="text-center py-12 px-6 text-neutral-500 dark:text-neutral-400">
          <div className="text-4xl mb-3">📷</div>
          <h3 className="text-[17px] font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
            No sightings posted yet
          </h3>
          <p className="text-sm">
            {isAdmin
              ? 'Use the form above to add the first bird sighting.'
              : 'Check back soon — our members are always out spotting!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {birds.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-surface-dark rounded-club overflow-hidden border border-borderLight dark:border-borderDark transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
            >
              {/* <div> */}
                <div className="w-full h-[180px] bg-gradient-to-br from-[#e8f5e9] to-[#e3f2fd] dark:from-[#0d2318] dark:to-[#0a1e34] flex items-center justify-center relative overflow-hidden">
                  {b.photo ? (
                    <Image
                      src={b.photo}
                      alt={b.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : null}
                  <span className="text-[64px] z-[1] select-none">{b.emoji}</span>
                  <span className="absolute top-2.5 left-2.5 bg-peacock text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-[0.5px] uppercase shadow-sm z-[2]">
                    {b.week}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteBird(b.id)}
                      className="absolute top-2.5 right-2.5 bg-rose hover:bg-[#b52651] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm z-[3] cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>

                <div className="p-3.5">
                  <div className="font-serif text-[15px] font-bold text-neutral-900 dark:text-neutral-50 mb-0.5">
                    {b.name}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 italic mb-2">
                    {b.latin || ''}
                  </div>
                </div>
              {/* </div> */}

              <div className="px-3.5 pb-3.5 flex flex-col items-center justify-between text-[11px]">
                <span className="text-jade dark:text-emerald-400 bg-jade-light dark:bg-jade-darkLight px-2 py-0.5 rounded-full font-medium">
                  📍 {b.location}
                </span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  By {b.spotter}
                </span>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
}
