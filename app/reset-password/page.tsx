'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    } else {
      setMessage({ type: 'success', text: 'Password updated. Redirecting to login...' });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--bg-app)] px-6 py-16 font-mono text-[var(--text-main)] selection:bg-[var(--color-moss)] selection:text-[var(--bg-app)]">
      <div className="relative z-10 w-full max-w-md group">
        <div className="clip-shape-2 relative rotate-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-md">
          <h1 className="mb-1 font-mono text-2xl font-light text-[var(--text-bright)]">new credentials</h1>
          <p className="mb-8 font-mono text-xs text-[var(--color-slate)]">set your new account password</p>

          {message && (
            <div className="mb-6">
              <div className={`border p-3 font-mono text-xs ${message.type === 'success' ? 'border-[var(--color-moss)] text-[var(--text-bright)]' : 'border-[var(--accent-pink)] text-[var(--accent-pink)]'}`}>
                {message.text}
              </div>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="mb-2 block font-mono text-xs text-[var(--text-muted)]">new password</label>
              <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent p-2 font-mono text-xs text-[var(--text-bright)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-mono text-xs text-[var(--text-muted)]">confirm password</label>
              <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent p-2 font-mono text-xs text-[var(--text-bright)] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="studio-btn clip-shape-1 w-full py-3.5 font-mono text-xs text-[var(--text-bright)] cursor-pointer"
            >
              {loading ? 'updating…' : 'update password ➔'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}