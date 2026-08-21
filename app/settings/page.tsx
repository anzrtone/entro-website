'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { BgDots, EntroCard } from '@/components/entro-ui';

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [slug, setSlug] = useState('');
  const [initialSlug, setInitialSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      setEmail(user.email ?? '');

      const { data: profile } = await supabase.from('profiles').select('slug').eq('user_id', user.id).single();
      if (profile) {
        setSlug(profile.slug);
        setInitialSlug(profile.slug);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const trimmedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

    if (!trimmedSlug) {
      setMessage({ type: 'error', text: 'Handle cannot be empty.' });
      setUpdating(false);
      return;
    }

    if (trimmedSlug !== initialSlug) {
      const { data: existing } = await supabase.from('profiles').select('slug').eq('slug', trimmedSlug).single();
      if (existing) {
        setMessage({ type: 'error', text: 'That handle is already taken by another user.' });
        setUpdating(false);
        return;
      }
    }

    const { error } = await supabase.from('profiles').update({ slug: trimmedSlug }).eq('user_id', user.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setInitialSlug(trimmedSlug);
      setMessage({ type: 'success', text: 'Credentials updated successfully.' });
    }
    setUpdating(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('CRITICAL WARNING: Are you sure you want to purge your account? This action cannot be undone.');
    if (!confirmed) return;

    setDeleting(true);
    setMessage(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: profileError } = await supabase.from('profiles').delete().eq('user_id', user.id);
    if (profileError) {
      setMessage({ type: 'error', text: profileError.message });
      setDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[var(--bg-app)] font-mono text-xs text-[var(--text-muted)] selection:bg-[var(--color-moss)] selection:text-[var(--bg-app)]">
        [loading_system_parameters...]
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen justify-center bg-[var(--bg-app)] px-6 py-16 font-mono text-[var(--text-main)] selection:bg-[var(--color-moss)] selection:text-[var(--bg-app)]">
      <BgDots />
      
      {/* Structural Slanted Divider Line */}
      <div className="pointer-events-none fixed -left-1/3 top-0 z-0 h-[150vh] w-[120vw] -rotate-[12deg] border-r border-[var(--color-moss)]/15" />

      <div className="relative z-10 w-full max-w-3xl space-y-8">
        
        {/* Header Block Card */}
        <EntroCard variant={1} accent="cyan" rotate={1}>
          <div className="p-8 sm:p-10">
            {/* Header / Brand */}
            <div className="mb-6 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <Link href="/" className="group/link flex items-center gap-3">
                <div className="logo-box h-7 w-7 border border-[var(--border-subtle)] bg-[var(--color-moss)] opacity-95 transition-transform duration-300 group-hover/link:-rotate-45 -rotate-2" />
                <span className="font-mono text-2xl font-normal tracking-tight text-[var(--text-bright)]">
                  entro<span className="text-[var(--text-muted)]">.</span>
                </span>
              </Link>
              <p className="font-mono text-[11px] tracking-widest text-[var(--text-muted)] -rotate-1">
                [sys_settings]
              </p>
            </div>

            <h1 className="mb-2 font-mono text-3xl font-light text-[var(--text-bright)] rotate-1">account settings</h1>
            <p className="font-mono text-xs text-[var(--color-slate)] -rotate-1">
              manage your core system parameters and entity identifiers.
            </p>
          </div>
        </EntroCard>

        {/* Status / Feedback Banner */}
        {message && (
          <div
            className={`clip-shape-2 rotate-1 border-2 p-4 font-mono text-xs shadow-md transition-all ${
              message.type === 'success'
                ? 'border-[var(--color-moss)] bg-[var(--bg-surface)] text-[var(--text-bright)]'
                : 'border-[var(--accent-pink)] bg-[var(--bg-surface)] text-[var(--accent-pink)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold">{message.type === 'success' ? '[SYS_OK]' : '[SYS_ERR]'}</span>
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Credentials Form Section */}
        <EntroCard variant={2} accent="cyan" rotate={-0.5}>
          <section className="space-y-6 p-8 sm:p-10">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <span className="label-mono text-xs text-[var(--text-bright)]">// 01 — profile credentials</span>
              <span className="cut-tag bg-[var(--color-moss)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--bg-app)] font-bold">
                ACTIVE
              </span>
            </div>

            <form onSubmit={handleUpdateCredentials} className="space-y-6">
              <div className="space-y-2">
                <label className="label-mono block text-xs">email address</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="input-retro clip-input w-full cursor-not-allowed opacity-60 bg-[var(--bg-app)]/50"
                />
              </div>

              <div className="space-y-2">
                <label className="label-mono block text-xs">handle / slug</label>
                <div className="input-retro clip-input flex items-center py-0 px-3 border border-[var(--border-subtle)] bg-[var(--bg-app)]">
                  <span className="select-none text-[var(--text-muted)] font-mono text-xs">entro.site/</span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="ml-1 w-full bg-transparent py-2.5 font-mono text-xs text-[var(--text-bright)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-retro-primary clip-btn w-full sm:w-auto"
                >
                  {updating ? 'updating parameters...' : 'update credentials'}
                </button>
              </div>
            </form>
          </section>
        </EntroCard>

        {/* Danger Zone Section */}
        <EntroCard variant={3} accent="pink" rotate={0.5}>
          <section className="space-y-6 p-8 sm:p-10">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <span className="label-mono text-xs text-[var(--accent-pink)]">// 02 — danger zone</span>
              <span className="cut-tag bg-[var(--accent-pink)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--bg-app)] font-bold">
                CRITICAL
              </span>
            </div>

            <p className="font-mono text-xs leading-relaxed text-[var(--text-muted)]">
              permanently purge your handle, profile parameters, linked blocks, and associated telemetry logs from system memory.
            </p>

            <div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="btn-retro-secondary border-[var(--accent-pink)]/40 hover:!border-[var(--accent-pink)] hover:!text-[var(--accent-pink)]"
              >
                {deleting ? 'purging entity...' : 'delete account'}
              </button>
            </div>
          </section>
        </EntroCard>

        {/* Footer Navigation Link */}
        <div className="mt-8 flex items-center justify-between border-t border-[var(--border-subtle)] pt-6 font-mono text-xs text-[var(--text-muted)] -rotate-1">
          <Link
            href="/"
            className="text-[var(--text-bright)] underline decoration-[var(--color-moss)]/40 hover:text-[var(--color-moss)]"
          >
            ➔ return to entro
          </Link>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-[var(--text-bright)] underline decoration-[var(--border-subtle)]">
              privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-bright)] underline decoration-[var(--border-subtle)]">
              terms
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}