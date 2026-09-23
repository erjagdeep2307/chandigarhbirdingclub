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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setErrorMsg('');
      setIsShaking(false);
      setTimeout(() => usernameInputRef.current?.focus(), 100);
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
    if (!username.trim() || !password.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Incorrect username or password. Please try again.');
        setIsShaking(true);
        setPassword('');
        setTimeout(() => setIsShaking(false), 500);
      }
    } catch {
      setErrorMsg('Connection error. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalBoxRef.current && !modalBoxRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const inputClass = `w-full px-4 py-3 border-2 rounded-[10px] text-[15px] outline-none transition-all bg-cream dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 ${
    isShaking
      ? 'border-rose animate-shake'
      : 'border-borderLight dark:border-borderDark focus:border-jade dark:focus:border-emerald-500'
  }`;

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
        className="w-full max-w-[400px] bg-white dark:bg-surface-dark border border-neutral-200 dark:border-borderDark rounded-[18px] p-8 text-center shadow-[0_24px_64px_rgba(0,0,0,0.3)] animate-pop-in text-neutral-900 dark:text-neutral-100"
      >
        <h2 id="modal-title" className="font-serif text-[22px] font-bold mb-1.5 text-neutral-900 dark:text-neutral-50">
          Admin Login
        </h2>
        <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-5">
          Sign in with your admin username and password to unlock editing tools.
        </p>

        <form onSubmit={handleSubmit} className="text-left">
          <label htmlFor="admin-username" className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            Username
          </label>
          <input
            id="admin-username"
            ref={usernameInputRef}
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            disabled={isLoading}
            className={`${inputClass} mb-3`}
          />

          <label htmlFor="admin-password" className="mb-1.5 block text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isLoading}
            className={`${inputClass} mb-2.5`}
          />

          <div className="text-xs text-rose font-medium min-h-[18px] mb-3.5 text-center">
            {errorMsg}
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
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
