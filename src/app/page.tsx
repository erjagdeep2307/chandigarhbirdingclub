'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Header, { TabType } from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AdminBar from '@/components/AdminBar';
import HornbillBanner from '@/components/HornbillBanner';
import PasswordModal from '@/components/PasswordModal';
import NatureWalksTab from '@/components/tabs/NatureWalksTab';
import BirdGalleryTab from '@/components/tabs/BirdGalleryTab';
import MembersTab from '@/components/tabs/MembersTab';
import AboutTab from '@/components/tabs/AboutTab';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { Walk, PastWalk, BirdSighting, Member } from '@/lib/types';
import { csrfHeaders } from '@/lib/csrf';
import { apiRequest, queryKeys } from '@/lib/api';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const queryClient = useQueryClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const authQuery = useQuery({
    queryKey: queryKeys.auth,
    queryFn: () => apiRequest<{ isAdmin: boolean }>('/api/auth/check'),
  });
  const walksQuery = useQuery({ queryKey: queryKeys.walks, queryFn: () => apiRequest<Walk[]>('/api/walks'), enabled: activeTab === 'home' || activeTab === 'walks' });
  const pastWalksQuery = useQuery({ queryKey: queryKeys.pastWalks, queryFn: () => apiRequest<PastWalk[]>('/api/walks/past'), enabled: activeTab === 'home' || activeTab === 'walks' });
  const birdsQuery = useQuery({ queryKey: queryKeys.birds, queryFn: () => apiRequest<BirdSighting[]>('/api/birds'), enabled: activeTab === 'gallery' });
  const membersQuery = useQuery({ queryKey: queryKeys.members, queryFn: () => apiRequest<Member[]>('/api/members'), enabled: activeTab === 'members' });
  const isAdmin = Boolean(authQuery.data?.isAdmin);
  const activeTabQuery = activeTab === 'home' || activeTab === 'walks'
    ? walksQuery
    : activeTab === 'gallery'
      ? birdsQuery
      : activeTab === 'members'
        ? membersQuery
        : null;

  const refreshData = () => queryClient.invalidateQueries({ queryKey: ['walks'] })
    .then(() => queryClient.invalidateQueries({ queryKey: queryKeys.birds }))
    .then(() => queryClient.invalidateQueries({ queryKey: queryKeys.members }));

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest<{ success: boolean }>('/api/auth/logout', { method: 'POST', headers: csrfHeaders() }),
    onSuccess: async () => {
      queryClient.setQueryData(queryKeys.auth, { isAdmin: false });
      await refreshData();
      toast.success('Logged out of admin mode.');
    },
    onError: (error) => toast.error(error.message || 'Could not log out. Please try again.'),
  });

  // Handle Logout
  const handleLogout = async () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-neutral-900">
      {/* Password Modal */}
      <PasswordModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          queryClient.setQueryData(queryKeys.auth, { isAdmin: true });
          refreshData();
          toast.success('Admin mode unlocked.');
        }}
      />

      {/* Header navigation */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Admin Status Bar */}
      <AdminBar
        isAdmin={isAdmin}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {activeTab === 'home' && <HeroSection onTabChange={setActiveTab} />}

      {/* Hornbill Banner */}
      <HornbillBanner />

      {/* Main Content Area */}
      <main id="club-content" className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-8 pb-16">
        {activeTabQuery?.isPending && (
          <p className="py-12 text-center text-sm text-neutral-500" role="status">Loading live data…</p>
        )}
        {activeTabQuery?.isError && (
          <div className="py-12 text-center" role="alert">
            <p className="text-sm text-rose">Could not load live data: {activeTabQuery.error.message}</p>
            <button type="button" onClick={() => activeTabQuery.refetch()} className="mt-3 text-sm font-semibold text-peacock underline">
              Try again
            </button>
          </div>
        )}
        {walksQuery.isSuccess && (activeTab === 'home' || activeTab === 'walks') && (
          <NatureWalksTab
            walks={walksQuery.data ?? []}
            pastWalks={pastWalksQuery.data ?? []}
            isAdmin={isAdmin}
          />
        )}
        {birdsQuery.isSuccess && activeTab === 'gallery' && (
          <BirdGalleryTab
            birds={birdsQuery.data ?? []}
            isAdmin={isAdmin}
          />
        )}
        {membersQuery.isSuccess && activeTab === 'members' && (
          <MembersTab
            members={membersQuery.data ?? []}
            isAdmin={isAdmin}
          />
        )}
        {activeTab === 'about' && <AboutTab />}
      </main>

      {/* Fantastic Club Footer */}
      <Footer onTabChange={setActiveTab} />
    </div>
  );
}
