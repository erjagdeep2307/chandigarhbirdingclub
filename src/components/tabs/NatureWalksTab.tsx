'use client';

import React, { useEffect, useState } from 'react';
import { Bird, Calendar, Clock, Leaf, MapPin, Users, X } from 'lucide-react';
import { Walk, PastWalk } from '@/lib/types';
import { toast } from 'sonner';
import { csrfHeaders } from '@/lib/csrf';

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
  const [selectedWalk, setSelectedWalk] = useState<Walk | null>(null);
  const [selectedPastWalk, setSelectedPastWalk] = useState<PastWalk | null>(null);

  useEffect(() => {
    if (!selectedWalk && !selectedPastWalk) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedWalk(null);
        setSelectedPastWalk(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPastWalk, selectedWalk]);

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
      toast.error('Please fill in Title, Date & Time, and Meeting Point.');
      return;
    }

    setIsSubmittingWalk(true);
    try {
      const res = await fetch('/api/walks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
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
        toast.success('Walk announcement posted.');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to post walk announcement.');
      }
    } catch {
      toast.error('Connection error while adding walk.');
    } finally {
      setIsSubmittingWalk(false);
    }
  };

  // Move walk to past via API
  const handleMoveToPast = async (id: number | string) => {
    if (!confirm('Move this walk to Past Walks?')) return;
    try {
      const res = await fetch(`/api/walks/${id}`, { method: 'PATCH', headers: csrfHeaders() });
      if (res.ok) {
        onRefresh();
        toast.success('Walk moved to Past Walks.');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to update walk status.');
      }
    } catch {
      toast.error('Connection error while moving walk.');
    }
  };

  // Add past walk record via API
  const handleAddPastWalk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastTitle.trim() || !pastDate.trim()) {
      toast.error('Please fill in Title and Date.');
      return;
    }

    setIsSubmittingPast(true);
    try {
      const res = await fetch('/api/walks/past', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...csrfHeaders() },
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
        toast.success('Past walk record added.');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to add past walk record.');
      }
    } catch {
      toast.error('Connection error while adding past walk.');
    } finally {
      setIsSubmittingPast(false);
    }
  };

  // Delete past walk via API
  const handleDeletePastWalk = async (id: number | string) => {
    if (!confirm('Delete this past walk permanently?')) return;
    try {
      const res = await fetch(`/api/walks/past/${id}`, { method: 'DELETE', headers: csrfHeaders() });
      if (res.ok) {
        onRefresh();
        toast.success('Past walk deleted.');
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to delete past walk.');
      }
    } catch {
      toast.error('Connection error while deleting past walk.');
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
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`View details for ${w.title}`}
              onClick={() => setSelectedWalk(w)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedWalk(w);
                }
              }}
              className="bg-white dark:bg-surface-dark rounded-club border-2 border-saffron/90 overflow-hidden shadow-[0_2px_12px_rgba(255,107,0,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 cursor-pointer flex flex-col justify-between"
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
                    onClick={(event) => {
                      event.stopPropagation();
                      handleMoveToPast(w.id);
                    }}
                    className="w-full bg-rose hover:bg-[#c02e5a] text-white py-2 px-4 rounded-lg text-[13px] font-semibold transition-all cursor-pointer"
                  >
                    ✓ Mark as Done / Move to Past
                  </button>
                ) : (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedWalk(w);
                    }}
                    className="w-full bg-saffron hover:brightness-95 text-white py-2 px-4 rounded-lg text-[13px] font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    View details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedWalk && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/65 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSelectedWalk(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="walk-detail-title"
            className="relative grid max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-club bg-white shadow-2xl dark:bg-surface-dark md:grid-cols-[minmax(0,1.05fr)_minmax(19rem,0.95fr)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[270px] overflow-hidden bg-jade dark:bg-jade-darkLight md:min-h-[540px]">
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85"
                alt="Forest trail for a nature walk"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jade/85 via-jade/15 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-flex items-center gap-2 rounded bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] backdrop-blur-sm">
                  <Leaf size={14} aria-hidden="true" /> Upcoming walk
                </span>
                <p className="mt-4 font-serif text-2xl font-bold">Chandigarh Birding Club</p>
              </div>
            </div>

            <div className="flex min-h-0 flex-col p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setSelectedWalk(null)}
                aria-label="Close walk details"
                title="Close"
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-borderLight bg-white text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-borderDark dark:bg-surface-dark dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p className="pr-10 text-[11px] font-bold uppercase tracking-[1.5px] text-saffron">Upcoming outing</p>
              <h2 id="walk-detail-title" className="mt-2 font-serif text-3xl font-bold text-jade dark:text-emerald-400">
                {selectedWalk.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {selectedWalk.desc || 'Details for this outing will be shared soon.'}
              </p>

              <div className="my-7 space-y-3 border-y border-borderLight py-5 dark:border-borderDark">
                <div className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <Calendar size={17} className="mt-0.5 shrink-0 text-saffron" aria-hidden="true" />
                  <span>{formatDatetime(selectedWalk.datetime)}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-rose" aria-hidden="true" />
                  <span>{selectedWalk.location}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <Clock size={17} className="mt-0.5 shrink-0 text-peacock" aria-hidden="true" />
                  <span>{selectedWalk.duration || 'Duration to be confirmed'}</span>
                </div>
              </div>

              {!isAdmin && (
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      'Thank you! Contact us at chandigarhbirdingclub2026@gmail.com to register for this walk.'
                    )
                  }
                  className="mt-auto w-full rounded-lg bg-saffron px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:brightness-95"
                >
                  Register interest
                </button>
              )}
            </div>
          </section>
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
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`View details for ${p.title}`}
              onClick={() => setSelectedPastWalk(p)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedPastWalk(p);
                }
              }}
              className="bg-white dark:bg-surface-dark rounded-xl border border-borderLight dark:border-borderDark overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-peacock focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950 cursor-pointer"
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
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeletePastWalk(p.id);
                    }}
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

      {selectedPastWalk && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/65 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSelectedPastWalk(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="past-walk-detail-title"
            className="relative grid max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-club bg-white shadow-2xl dark:bg-surface-dark md:grid-cols-[minmax(0,1.05fr)_minmax(19rem,0.95fr)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-[270px] overflow-hidden bg-jade dark:bg-jade-darkLight md:min-h-[540px]">
              <img
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85"
                alt="Forest trail from a nature walk"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jade/85 via-jade/15 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-flex items-center gap-2 rounded bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] backdrop-blur-sm">
                  <Leaf size={14} aria-hidden="true" /> Completed walk
                </span>
                <p className="mt-4 font-serif text-2xl font-bold">Chandigarh Birding Club</p>
              </div>
            </div>

            <div className="flex min-h-0 flex-col p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setSelectedPastWalk(null)}
                aria-label="Close past walk details"
                title="Close"
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-borderLight bg-white text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-borderDark dark:bg-surface-dark dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p className="pr-10 text-[11px] font-bold uppercase tracking-[1.5px] text-peacock dark:text-sky-400">Past outing</p>
              <h2 id="past-walk-detail-title" className="mt-2 font-serif text-3xl font-bold text-jade dark:text-emerald-400">
                {selectedPastWalk.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                A completed Chandigarh Birding Club outing recorded in our walk archive.
              </p>

              <div className="my-7 space-y-3 border-y border-borderLight py-5 dark:border-borderDark">
                <div className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                  <Calendar size={17} className="mt-0.5 shrink-0 text-saffron" aria-hidden="true" />
                  <span>{selectedPastWalk.date}</span>
                </div>
                {selectedPastWalk.participants !== '—' && (
                  <div className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                    <Users size={17} className="mt-0.5 shrink-0 text-peacock" aria-hidden="true" />
                    <span>{selectedPastWalk.participants} participants</span>
                  </div>
                )}
                {selectedPastWalk.species !== '—' && (
                  <div className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-200">
                    <Bird size={17} className="mt-0.5 shrink-0 text-rose" aria-hidden="true" />
                    <span>{selectedPastWalk.species} species recorded</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPastWalk(null)}
                className="mt-auto w-full rounded-lg bg-peacock px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#004788]"
              >
                Close details
              </button>
            </div>
          </section>
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
