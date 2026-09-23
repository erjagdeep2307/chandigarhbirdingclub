'use client';

import { LogOut } from 'lucide-react';
import React from 'react';

interface AdminBarProps {
  isAdmin: boolean;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  isDbConnected?: boolean;
}

export default function AdminBar({
  isAdmin,
  onOpenLoginModal,
  onLogout,
}: AdminBarProps) {
  return (
    <div className="bg-[#1a1a1a] border-b-[3px] border-hornbill-yellow shadow-sm">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs">
        {/* Left: Status Dot & Text */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isAdmin
                ? 'bg-[#2ECC71] shadow-[0_0_6px_#2ECC71]'
                : 'bg-neutral-600'
            }`}
          />
          <span
            className={`transition-colors font-medium ${
              isAdmin
                ? 'text-hornbill-yellow font-semibold'
                : 'text-neutral-400'
            }`}
          >
            {isAdmin
              ? '🟢 Admin mode active — you can add, edit and delete content via API'
              : 'Viewing as guest'}
          </span>
        </div>

        {/* Right: Login/Logout Actions */}
        <div>
          {isAdmin ? (
            <button
              onClick={onLogout}
              className="text-neutral-400 border border-neutral-700 hover:border-rose hover:text-rose px-3.5 py-1.5 rounded-md font-semibold transition-all hover:bg-rose/10 cursor-pointer"
              title='logout'
            >
              {/* 🔒 Logout */}
              <LogOut />
            </button>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="bg-hornbill-yellow text-neutral-900 hover:bg-amber-400 px-3.5 py-1.5 rounded-md font-bold transition-all shadow-sm cursor-pointer"
            >
              🔐 Admin Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
