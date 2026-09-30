'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, UserRound, X, LoaderCircle, Upload } from 'lucide-react';
import { BirdSighting } from '@/lib/types';
import { toast } from 'sonner';
import { csrfHeaders } from '@/lib/csrf';
import { getCloudinaryModalUrl, uploadCloudinary } from '@/lib/cloudinary';

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
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [latin, setLatin] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState('');
  const [emoji, setEmoji] = useState('🐦');
  const [spotter, setSpotter] = useState('');
  const [week, setWeek] = useState('This week');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedBird, setSelectedBird] = useState<BirdSighting | null>(null);

  useEffect(() => {
    if (!selectedBird) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedBird(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBird]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    setIsUploadingImage(true);
    try {
      const { secure_url } = await uploadCloudinary(file);
      setPhoto(secure_url);
      toast.success('Image uploaded.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Add sighting via API
  const handleAddSighting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      toast.error('Please fill in Bird Name and Location.');
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
        toast.success('Bird sighting added.');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to add bird sighting.');
      }
    } catch {
      toast.error('Connection error while adding sighting.');
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
        toast.success('Bird sighting removed.');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to remove bird sighting.');
      }
    } catch {
      toast.error('Connection error while removing sighting.');
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
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="https://..."
                    className="min-w-0 flex-1 px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploadingImage || isSubmitting}
                    title={isUploadingImage ? 'Uploading image' : 'Upload image'}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-peacock text-peacock transition-colors hover:bg-peacock hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUploadingImage ? (
                      <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
                    ) : (
                      <Upload size={16} aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {isUploadingImage ? 'Uploading image' : 'Upload image'}
                    </span>
                  </button>
                </div>
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
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`View details for ${b.name}`}
              onClick={() => setSelectedBird(b)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedBird(b);
                }
              }}
              className="bg-white dark:bg-surface-dark rounded-club overflow-hidden border border-borderLight dark:border-borderDark transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-peacock focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 cursor-pointer flex flex-col justify-between"
            >
              {/* <div> */}
                <div className="w-full h-[180px] bg-gradient-to-br from-[#e8f5e9] to-[#e3f2fd] dark:from-[#0d2318] dark:to-[#0a1e34] flex items-center justify-center relative overflow-hidden">
                  {b.photo ? (
                    <Image
                      src={b.photo}
                      alt={b.name}
                      unoptimized
                      className="object-contain"
                      height={180}
                      width={247}
                    />
                  ) : <span className="text-[64px] z-[1] select-none">{b.emoji}</span>}

                  <span className="absolute top-2.5 left-2.5 bg-peacock text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-[0.5px] uppercase shadow-sm z-[2]">
                    {b.week}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteBird(b.id);
                      }}
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

      {selectedBird && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/65 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSelectedBird(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="bird-detail-title"
            className="relative grid w-full max-w-4xl overflow-hidden rounded-club bg-white shadow-2xl dark:bg-surface-dark md:grid-cols-[minmax(0,1.05fr)_minmax(19rem,0.95fr)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[280px] bg-gradient-to-br from-jade-light to-peacock-light dark:from-jade-darkLight dark:to-peacock-darkLight md:min-h-[520px]">
              {selectedBird.photo ? (
                <Image
                  src={getCloudinaryModalUrl(selectedBird.photo)}
                  alt={selectedBird.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 52vw"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-9xl select-none">
                  {selectedBird.emoji}
                </span>
              )}
              <span className="absolute left-5 top-5 rounded bg-peacock px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1.5px] text-white shadow-sm">
                {selectedBird.week}
              </span>
            </div>

            <div className="flex min-h-0 flex-col p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setSelectedBird(null)}
                aria-label="Close bird details"
                title="Close"
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-borderLight bg-white text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-borderDark dark:bg-surface-dark dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p className="pr-10 text-[11px] font-bold uppercase tracking-[1.5px] text-peacock dark:text-sky-400">Member sighting</p>
              <h2 id="bird-detail-title" className="mt-2 font-serif text-3xl font-bold text-jade dark:text-emerald-400">
                {selectedBird.name}
              </h2>
              {selectedBird.latin && (
                <p className="mt-1 text-sm italic text-neutral-500 dark:text-neutral-400">{selectedBird.latin}</p>
              )}

              <div className="my-7 space-y-3 border-y border-borderLight py-5 dark:border-borderDark">
                <div className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <MapPin size={17} className="shrink-0 text-rose" aria-hidden="true" />
                  <span>{selectedBird.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <UserRound size={17} className="shrink-0 text-peacock" aria-hidden="true" />
                  <span>Spotted by {selectedBird.spotter}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <Calendar size={17} className="shrink-0 text-saffron" aria-hidden="true" />
                  <span>{selectedBird.week}</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                A community sighting shared with the Chandigarh Birding Club gallery.
              </p>
              <button
                type="button"
                onClick={() => setSelectedBird(null)}
                className="mt-auto w-full rounded-lg bg-peacock px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#004788]"
              >
                Close details
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
