'use client';

import React, { useState } from 'react';
import { Member } from '@/lib/types';
import { useToast } from '@/components/ToastContext';

interface MembersTabProps {
  members: Member[];
  isAdmin: boolean;
  onRefresh: () => void;
}

export default function MembersTab({
  members,
  isAdmin,
  onRefresh,
}: MembersTabProps) {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [specialty, setSpecialty] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute initials helper
  const initials = (str: string) => {
    return str
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Add member via API
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter the member name.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || 'Member',
          year: parseInt(year, 10) || new Date().getFullYear(),
          specialty: specialty.trim() || '',
        }),
      });

      if (res.ok) {
        setName('');
        setRole('');
        setYear(String(new Date().getFullYear()));
        setSpecialty('');
        onRefresh();
        showToast('Member added.', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to add member.', 'error');
      }
    } catch {
      showToast('Connection error while adding member.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete member via API
  const handleDeleteMember = async (id: number | string) => {
    if (!confirm('Remove this member?')) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
        showToast('Member removed.', 'success');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to remove member.', 'error');
      }
    } catch {
      showToast('Connection error while removing member.', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-[28px] font-bold text-jade dark:text-emerald-400">
            👥 Club Members
          </h2>
          <p className="text-[14px] text-neutral-500 dark:text-neutral-400 mt-1.5">
            {members.length > 0
              ? `${members.length} passionate birder${members.length !== 1 ? 's' : ''} and counting`
              : 'Our wonderful birding community'}
          </p>
        </div>
      </div>

      {/* Admin Panel: Add Member */}
      {isAdmin && (
        <div className="bg-white dark:bg-surface-dark border-2 border-dashed border-jade rounded-club p-6 mb-7 shadow-sm">
          <h3 className="text-[15px] font-semibold text-jade dark:text-emerald-400 mb-4">
            ➕ Add a New Member
          </h3>
          <form onSubmit={handleAddMember}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-jade"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Member, Secretary, Treasurer"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-jade"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Joined Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2000"
                  max="2099"
                  placeholder="2024"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-jade"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Raptors, Migratory birds"
                  className="w-full px-3 py-2 border border-borderLight dark:border-borderDark rounded-lg text-[13px] bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 outline-none focus:border-jade"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-jade hover:bg-[#135a38] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Adding via API...' : '➕ Add Member'}
            </button>
          </form>
        </div>
      )}

      {/* Members Grid */}
      {members.length === 0 ? (
        <div className="text-center py-12 px-6 text-neutral-500 dark:text-neutral-400">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-[17px] font-semibold mb-2 text-neutral-800 dark:text-neutral-200">
            No members added yet
          </h3>
          <p className="text-sm">
            {isAdmin
              ? 'Use the form above to add the first member.'
              : 'Member list coming soon!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="relative bg-white dark:bg-surface-dark rounded-xl border border-borderLight dark:border-borderDark p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col items-center justify-between"
            >
              {isAdmin && (
                <button
                  onClick={() => handleDeleteMember(m.id)}
                  title="Remove member"
                  className="absolute top-2 right-2 text-neutral-400 hover:text-rose hover:bg-rose/10 p-1 rounded transition-colors text-sm cursor-pointer"
                >
                  ✕
                </button>
              )}

              <div>
                <div
                  className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center font-serif text-xl font-bold text-white shadow-sm select-none ${m.av}`}
                >
                  {initials(m.name)}
                </div>
                <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-1 leading-snug">
                  {m.name}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  {m.role}
                </div>
                {m.specialty && (
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-2.5">
                    🐦 {m.specialty}
                  </div>
                )}
              </div>

              <span className="text-[11px] text-neutral-600 dark:text-neutral-300 bg-saffron-light dark:bg-saffron-darkLight px-2 py-0.5 rounded-full inline-block font-medium mt-auto">
                Since {m.year}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
