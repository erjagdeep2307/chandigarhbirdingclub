'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasswordModal({
  isOpen,
  onClose,
  onSuccess,
}: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMsg('');
      setIsShaking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || '❌ Incorrect password. Please try again.');
        setIsShaking(true);
        setPassword('');
        setTimeout(() => setIsShaking(false), 500);
      }
    } catch {
      setErrorMsg('❌ Connection error. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  // Light dismiss when clicking outside modal box
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalBoxRef.current && !modalBoxRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-[2px] animate-fade-in"
    >
      <div
        ref={modalBoxRef}
        className="w-full max-w-[380px] bg-white dark:bg-surface-dark border border-neutral-200 dark:border-borderDark rounded-[18px] p-8 text-center shadow-[0_24px_64px_rgba(0,0,0,0.3)] animate-pop-in text-neutral-900 dark:text-neutral-100"
      >
        <div className="text-4xl mb-3.5 select-none" aria-hidden="true">
          🔐
        </div>
        <h2 id="modal-title" className="font-serif text-[22px] font-bold mb-1.5 text-neutral-900 dark:text-neutral-50">
          Admin Login
        </h2>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-5">
          Enter the club admin password to unlock editing tools.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            disabled={isLoading}
            className={`w-full px-4 py-3 border-2 rounded-[10px] text-center tracking-[3px] text-[15px] outline-none transition-all mb-2.5 bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 ${
              isShaking
                ? 'border-rose animate-shake'
                : 'border-borderLight dark:border-borderDark focus:border-jade dark:focus:border-emerald-500'
            }`}
          />

          <div className="text-xs text-rose font-medium min-h-[18px] mb-3.5">
            {errorMsg}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-jade hover:bg-[#135a38] text-white py-3 rounded-[10px] text-sm font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Unlock Admin Mode'}
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-[13px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 underline transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
