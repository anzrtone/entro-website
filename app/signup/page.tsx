'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const slug = searchParams.get('slug');
    const destination = slug ? `/dashboard?slug=${encodeURIComponent(slug)}` : '/dashboard';

    router.push(destination);
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--bg-app)] px-6 py-16 font-mono text-[var(--text-main)] selection:bg-[var(--color-moss)] selection:text-[var(--bg-app)]">
      {/* Background Ambience Dots */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="pointer-events-none fixed -left-1/3 top-0 z-0 h-[150vh] w-[120vw] -rotate-[12deg] border-r border-[var(--color-moss)]/15" />

      <div className="relative z-10 w-full max-w-md group">
        {/* Tapered Pink Neon Accent Slit that rotates and responds in tandem with the card hover */}
        <div
          className="clip-shape-2 absolute inset-0 translate-x-3.5 translate-y-3.5 rotate-1 opacity-85 pointer-events-none transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0"
          style={{
            background: 'linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-pink) 25%, transparent 80%)',
          }}
        />

        <div className="relative transition-all duration-300">
          <div className="clip-shape-2 relative rotate-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-md transition-all duration-300 hover:border-[var(--text-bright)] hover:translate-x-3.5 hover:translate-y-3.5 hover:rotate-0">
            <div className="mb-6 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <Link href="/" className="group/link flex items-center gap-3">
                <div className="logo-box h-7 w-7 border border-[var(--border-subtle)] bg-[var(--color-moss)] opacity-95 transition-transform duration-300 group-hover/link:-rotate-45 -rotate-2" />
                <span className="font-mono text-2xl font-normal tracking-tight text-[var(--text-bright)]">
                  entro<span className="text-[var(--text-muted)]">.</span>
                </span>
              </Link>
              <p className="font-mono text-[11px] tracking-widest text-[var(--text-muted)] -rotate-1">
                [sys_register]
              </p>
            </div>

            <h1 className="mb-1 font-mono text-2xl font-light text-[var(--text-bright)] rotate-1">initialize world</h1>
            <p className="mb-8 font-mono text-xs text-[var(--color-slate)] -rotate-1">
              create your account to claim your unique handle
            </p>

            {errorMsg && (
              <div className="mb-6 rotate-1">
                <div className="clip-shape-1 border border-[var(--border-subtle)] border-l-4 border-l-[var(--accent-pink)] bg-[var(--bg-card)] px-4 py-3 font-mono text-xs text-[var(--text-muted)]">
                  {errorMsg}
                </div>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="rotate-1">
                <label className="mb-2 block font-mono text-xs text-[var(--text-muted)]">
                  email address
                </label>
                <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1 transition-colors focus-within:border-[var(--text-bright)]">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent p-2 font-mono text-xs text-[var(--text-bright)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="-rotate-1">
                <label className="mb-2 block font-mono text-xs text-[var(--text-muted)]">
                  password
                </label>
                <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1 transition-colors focus-within:border-[var(--text-bright)]">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent p-2 font-mono text-xs text-[var(--text-bright)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-2 w-full rotate-1 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="primary-action-btn clip-shape-1 w-full py-3.5 font-mono text-xs font-bold cursor-pointer active:scale-[0.97] active:translate-y-0.5"
                >
                  {loading ? 'initializing…' : 'create account ➔'}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center font-mono text-xs text-[var(--text-muted)] -rotate-1">
              already have an account?{' '}
              <Link href="/login" className="text-[var(--text-bright)] underline decoration-[var(--color-moss)]/40 hover:text-[var(--color-moss)]">
                log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}