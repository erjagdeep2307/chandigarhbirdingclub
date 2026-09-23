'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header, { TabType } from '@/components/Header';
import AdminBar from '@/components/AdminBar';
import HornbillBanner from '@/components/HornbillBanner';
import PasswordModal from '@/components/PasswordModal';
import NatureWalksTab from '@/components/tabs/NatureWalksTab';
import BirdGalleryTab from '@/components/tabs/BirdGalleryTab';
import MembersTab from '@/components/tabs/MembersTab';
import AboutTab from '@/components/tabs/AboutTab';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ToastContext';
import { Walk, PastWalk, BirdSighting, Member } from '@/lib/types';
import {
  initialMockWalks,
  initialMockPastWalks,
  initialMockBirds,
  initialMockMembers,
} from '@/lib/initialData';

export default function Home() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('walks');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Initialize with initial data immediately so there's ZERO loading delay
  const [walks, setWalks] = useState<Walk[]>(initialMockWalks);
  const [pastWalks, setPastWalks] = useState<PastWalk[]>(initialMockPastWalks);
  const [birds, setBirds] = useState<BirdSighting[]>(initialMockBirds);
  const [members, setMembers] = useState<Member[]>(initialMockMembers);

  // Check admin session status
  const checkAdminStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      setIsAdmin(Boolean(data.isAdmin));
    } catch {
      setIsAdmin(false);
    }
  }, []);

  // Fetch updated club data from Neon PostgreSQL / API in background
  const fetchData = useCallback(async () => {
    try {
      const [walksRes, pastWalksRes, birdsRes, membersRes] = await Promise.all([
        fetch('/api/walks'),
        fetch('/api/walks/past'),
        fetch('/api/birds'),
        fetch('/api/members'),
      ]);

      if (walksRes.ok) {
        const data = await walksRes.json();
        if (Array.isArray(data) && data.length > 0) setWalks(data);
      }
      if (pastWalksRes.ok) {
        const data = await pastWalksRes.json();
        if (Array.isArray(data) && data.length > 0) setPastWalks(data);
      }
      if (birdsRes.ok) {
        const data = await birdsRes.json();
        if (Array.isArray(data) && data.length > 0) setBirds(data);
      }
      if (membersRes.ok) {
        const data = await membersRes.json();
        if (Array.isArray(data) && data.length > 0) setMembers(data);
      }
    } catch (err) {
      console.warn('API sync: using current data', err);
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();
    fetchData();
  }, [checkAdminStatus, fetchData]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsAdmin(false);
      fetchData();
      showToast('Logged out of admin mode.', 'success');
    } catch (err) {
      console.error('Error logging out:', err);
      showToast('Could not log out. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-[#0c120f] text-neutral-900 dark:text-neutral-100 transition-colors duration-250">
      {/* Password Modal */}
      <PasswordModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsAdmin(true);
          fetchData();
          showToast('Admin mode unlocked.', 'success');
        }}
      />

      {/* Header with navigation and theme switcher */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Admin Status Bar */}
      <AdminBar
        isAdmin={isAdmin}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Hornbill Banner */}
      <HornbillBanner />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-8 pb-16">
        {activeTab === 'walks' && (
          <NatureWalksTab
            walks={walks}
            pastWalks={pastWalks}
            isAdmin={isAdmin}
            onRefresh={fetchData}
          />
        )}
        {activeTab === 'gallery' && (
          <BirdGalleryTab
            birds={birds}
            isAdmin={isAdmin}
            onRefresh={fetchData}
          />
        )}
        {activeTab === 'members' && (
          <MembersTab
            members={members}
            isAdmin={isAdmin}
            onRefresh={fetchData}
          />
        )}
        {activeTab === 'about' && <AboutTab />}
      </main>

      {/* Fantastic Club Footer */}
      <Footer onTabChange={setActiveTab} />
    </div>
  );
}
