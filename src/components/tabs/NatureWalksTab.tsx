'use client';

import React, { useState } from 'react';
import { Walk, PastWalk } from '@/lib/types';
import { useToast } from '@/components/ToastContext';

interface NatureWalksTabProps {
  walks: Walk[];
  pastWalks: PastWalk[];
  isAdmin: boolean;
  onRefresh: () => void;
}

export default function NatureWalksTab({
  walks,
  pastWalks,
  isAdmin,
  onRefresh,
}: NatureWalksTabProps) {
  const { showToast } = useToast();

  // New walk form state
  const [walkTitle, setWalkTitle] = useState('');
  const [walkDatetime, setWalkDatetime] = useState('');
  const [walkLocation, setWalkLocation] = useState('');
  const [walkDuration, setWalkDuration] = useState('');
  const [walkDesc, setWalkDesc] = useState('');
  const [isSubmittingWalk, setIsSubmittingWalk] = useState(false);

  // Past walk form state
  const [pastTitle, setPastTitle] = useState('');
  const [pastDate, setPastDate] = useState('');
  const [pastParticipants, setPastParticipants] = useState('');
  const [pastSpecies, setPastSpecies] = useState('');
  const [pastEmoji, setPastEmoji] = useState('🌿');
  const [isSubmittingPast, setIsSubmittingPast] = useState(false);

  // Format date helper
  const formatDatetime = (str: string) => {
    try {
      const d = new Date(str);
      return (
        d.toLocaleDateString('en-IN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }) +
        ' · ' +
        d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      );
    } catch {
      return str;
    }
  };

  // Add new walk announcement via API
  const handleAddWalk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkTitle.trim() || !walkDatetime || !walkLocation.trim()) {
      showToast('Please fill in Title, Date & Time, and Meeting Point.', 'error');
      return;
    }

    setIsSubmittingWalk(true);
    try {
      const res = await fetch('/api/walks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: walkTitle.trim(),
          datetime: walkDatetime,
          location: walkLocation.trim(),
          duration: walkDuration.trim() || 'TBD',
          desc: walkDesc.trim(),
        }),
      });

      if (res.ok) {
        setWalkTitle('');
        setWalkDatetime('');
        setWalkLocation('');
        setWalkDuration('');
        setWalkDesc('');
        onRefresh();
        showToast('Walk announcement posted.', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to post walk announcement.', 'error');
      }
    } catch {
      showToast('Connection error while adding walk.', 'error');
    } finally {
      setIsSubmittingWalk(false);
    }
  };

  // Move walk to past via API
  const handleMoveToPast = async (id: number | string) => {
    if (!confirm('Move this walk to Past Walks?')) return;
    try {
      const res = await fetch(`/api/walks/${id}`, { method: 'PATCH' });
      if (res.ok) {
        onRefresh();
        showToast('Walk moved to Past Walks.', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to update walk status.', 'error');
      }
    } catch {
      showToast('Connection error while moving walk.', 'error');
    }
  };

  // Add past walk record via API
  const handleAddPastWalk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastTitle.trim() || !pastDate.trim()) {
      showToast('Please fill in Title and Date.', 'error');
      return;
    }

    setIsSubmittingPast(true);
    try {
      const res = await fetch('/api/walks/past', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pastTitle.trim(),
          date: pastDate.trim(),
          participants: pastParticipants.trim() || '—',
          species: pastSpecies.trim() || '—',
          emoji: pastEmoji.trim() || '🌿',
        }),
      });

      if (res.ok) {
        setPastTitle('');
        setPastDate('');
        setPastParticipants('');
        setPastSpecies('');
        setPastEmoji('🌿');
        onRefresh();
        showToast('Past walk record added.', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to add past walk record.', 'error');
      }
    } catch {
      showToast('Connection error while adding past walk.', 'error');
    } finally {
      setIsSubmittingPast(false);
    }
  };

  // Delete past walk via API
  const handleDeletePastWalk = async (id: number | string) => {
    if (!confirm('Delete this past walk permanently?')) return;
    try {
      const res = await fetch(`/api/walks/past/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
        showToast('Past walk deleted.', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to delete past walk.', 'error');
      }
    } catch {
      showToast('Connection error while deleting past walk.', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-[28px] font-bold text-jade dark:text-emerald-400">
            🌿 Nature Walks
          </h2>
          <p className="text-[14px] text-neutral-500 dark:text-neutral-400 mt-1.5">
            Upcoming outings and birding expeditions around Chandigarh
          </p>
        </div>
      </div>

      {/* Admin Panel: Post New Walk Announcement */}
      {isAdmin && (
        <div className="bg-white dark:bg-surface-dark border-2 border-dashed border-saffron rounded-club p-6 mb-7 shadow-sm">
          <h3 className="text-[15px] font-semibold text-saffron mb-4">
            📢 Post a New Walk Announcement
          </h3>
          <form onSubmit={handleAddWalk}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Walk Title
                </label>
                <input
                  type="text"
                  value={walkTitle}
                  onChange={(e) => setWalkTitle(e.target.value)}
                  placeholder="e.g. Sukhna Lake Dawn Walk"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-saffron"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={walkDatetime}
                  onChange={(e) => setWalkDatetime(e.target.value)}
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-saffron"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Meeting Point
                </label>
                <input
                  type="text"
                  value={walkLocation}
                  onChange={(e) => setWalkLocation(e.target.value)}
                  placeholder="e.g. Sukhna Lake entrance gate"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-saffron"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={walkDuration}
                  onChange={(e) => setWalkDuration(e.target.value)}
                  placeholder="e.g. 3 hours"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-saffron"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                Description
              </label>
              <textarea
                value={walkDesc}
                onChange={(e) => setWalkDesc(e.target.value)}
                placeholder="Describe the walk, target species, what to bring..."
                rows={3}
                className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-saffron"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingWalk}
              className="bg-jade hover:bg-[#135a38] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingWalk ? 'Posting via API...' : '📣 Post Announcement'}
            </button>
          </form>
        </div>
      )}

      {/* Upcoming Walks Grid */}
      {walks.length === 0 ? (
        <div className="bg-saffron-light dark:bg-saffron-darkLight border border-saffron-mid rounded-xl p-4 sm:p-5 text-[13px] text-saffron font-medium mb-6 flex items-center gap-2">
          🌿 No upcoming walks announced yet — check back soon! Browse our past walks below.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {walks.map((w) => (
            <div
              key={w.id}
              className="bg-white dark:bg-surface-dark rounded-club border-2 border-saffron/90 overflow-hidden shadow-[0_2px_12px_rgba(255,107,0,0.08)] flex flex-col justify-between"
            >
              <div>
                <div className="bg-gradient-to-r from-saffron to-saffron-mid px-4 py-3.5 flex justify-between items-start gap-3">
                  <span className="bg-white text-saffron text-[10px] font-bold tracking-[1.5px] uppercase px-2 py-0.5 rounded">
                    Upcoming
                  </span>
                  <span className="text-white/95 text-xs font-medium text-right">
                    {formatDatetime(w.datetime)}
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-serif text-[17px] font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                    {w.title}
                  </h3>
                  <p className="text-[13px] text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                    {w.desc || 'Details to be announced.'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3.5">
                    <span className="flex items-center gap-1 text-xs text-jade dark:text-emerald-400 bg-jade-light dark:bg-jade-darkLight px-2.5 py-1 rounded-full font-medium">
                      📍 {w.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-jade dark:text-emerald-400 bg-jade-light dark:bg-jade-darkLight px-2.5 py-1 rounded-full font-medium">
                      ⏱ {w.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                {isAdmin ? (
                  <button
                    onClick={() => handleMoveToPast(w.id)}
                    className="w-full bg-rose hover:bg-[#c02e5a] text-white py-2 px-4 rounded-lg text-[13px] font-semibold transition-all cursor-pointer"
                  >
                    ✓ Mark as Done / Move to Past
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      showToast(
                        'Thank you! Contact us at chandigarhbirdingclub2026@gmail.com to register for this walk.',
                        'info'
                      )
                    }
                    className="w-full bg-saffron hover:brightness-95 text-white py-2 px-4 rounded-lg text-[13px] font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    Register Interest
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Past Walks Title */}
      <h3 className="font-serif text-xl text-peacock dark:text-sky-400 mb-4 flex items-center gap-3 after:content-[''] after:flex-1 after:h-[1.5px] after:bg-peacock-light dark:after:bg-peacock-darkLight after:rounded-full">
        📖 Past Nature Walks
      </h3>

      {/* Past Walks Grid */}
      {pastWalks.length === 0 ? (
        <div className="text-center py-12 px-6 text-neutral-500 dark:text-neutral-400">
          <div className="text-4xl mb-3">📖</div>
          <h3 className="text-[17px] font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
            {isAdmin ? 'No past walks yet' : 'No past walks recorded yet'}
          </h3>
          <p className="text-sm">
            {isAdmin
              ? 'Use the form below to add your first past walk entry.'
              : 'Check back soon!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {pastWalks.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-surface-dark rounded-xl border border-borderLight dark:border-borderDark overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-full h-[120px] bg-gradient-to-br from-jade-light to-peacock-light dark:from-jade-darkLight dark:to-peacock-darkLight flex items-center justify-center text-5xl">
                {p.emoji || '🌿'}
              </div>
              <div className="p-3.5">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                  {p.title}
                </h4>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 flex flex-wrap gap-2.5">
                  <span>📅 {p.date}</span>
                  {p.participants !== '—' && <span>👥 {p.participants}</span>}
                  {p.species !== '—' && <span>🐦 {p.species} spp</span>}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePastWalk(p.id)}
                    className="mt-2.5 border border-rose text-rose hover:bg-rose hover:text-white rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Panel: Add Past Walk Record */}
      {isAdmin && (
        <div className="bg-white dark:bg-surface-dark border-2 border-dashed border-peacock rounded-club p-6 mb-7 shadow-sm">
          <h3 className="text-[15px] font-semibold text-peacock dark:text-sky-400 mb-4">
            📖 Add a Past Walk Record
          </h3>
          <form onSubmit={handleAddPastWalk}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Walk Title
                </label>
                <input
                  type="text"
                  value={pastTitle}
                  onChange={(e) => setPastTitle(e.target.value)}
                  placeholder="e.g. Sukhna Winter Walk"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Date (e.g. Dec 2025)
                </label>
                <input
                  type="text"
                  value={pastDate}
                  onChange={(e) => setPastDate(e.target.value)}
                  placeholder="Jan 2026"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  No. of Participants
                </label>
                <input
                  type="text"
                  value={pastParticipants}
                  onChange={(e) => setPastParticipants(e.target.value)}
                  placeholder="e.g. 18"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Species Spotted
                </label>
                <input
                  type="text"
                  value={pastSpecies}
                  onChange={(e) => setPastSpecies(e.target.value)}
                  placeholder="e.g. 34"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                Emoji
              </label>
              <input
                type="text"
                value={pastEmoji}
                onChange={(e) => setPastEmoji(e.target.value)}
                maxLength={4}
                placeholder="🌸"
                className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-peacock"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingPast}
              className="bg-peacock hover:bg-[#004788] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmittingPast ? 'Adding via API...' : '➕ Add Past Walk'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
