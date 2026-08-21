'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  const lastUpdated = 'August 2026';

  return (
    <div className="relative flex min-h-screen justify-center bg-[var(--bg-app)] px-6 py-16 font-mono text-[var(--text-main)] selection:bg-[var(--color-moss)] selection:text-[var(--bg-app)]">
      {/* Background Ambience Dots */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="pointer-events-none fixed -left-1/3 top-0 z-0 h-[150vh] w-[120vw] -rotate-[12deg] border-r border-[var(--color-moss)]/15" />

      <div className="relative z-10 w-full max-w-3xl group">
        {/* Tapered Cyan Neon Accent Slit backdrop */}
        <div
          className="clip-shape-2 absolute inset-0 translate-x-3.5 translate-y-3.5 rotate-1 opacity-85 pointer-events-none transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0"
          style={{
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-cyan) 25%, transparent 80%)',
          }}
        />

        <div className="relative transition-all duration-300">
          <div className="clip-shape-2 relative rotate-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 sm:p-12 shadow-md transition-all duration-300 hover:border-[var(--text-bright)] hover:translate-x-3.5 hover:translate-y-3.5 hover:rotate-0">
            
            {/* Header / Brand */}
            <div className="mb-8 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <Link href="/" className="group/link flex items-center gap-3">
                <div className="logo-box h-7 w-7 border border-[var(--border-subtle)] bg-[var(--color-moss)] opacity-95 transition-transform duration-300 group-hover/link:-rotate-45 -rotate-2" />
                <span className="font-mono text-2xl font-normal tracking-tight text-[var(--text-bright)]">
                  entro<span className="text-[var(--text-muted)]">.</span>
                </span>
              </Link>
              <p className="font-mono text-[11px] tracking-widest text-[var(--text-muted)] -rotate-1">
                [sys_privacy]
              </p>
            </div>

            {/* Page Title */}
            <h1 className="mb-2 font-mono text-3xl font-light text-[var(--text-bright)] rotate-1">privacy policy</h1>
            <p className="mb-8 font-mono text-xs text-[var(--color-slate)] -rotate-1">
              effective date / last updated: <span className="text-[var(--text-bright)]">{lastUpdated}</span>
            </p>

            {/* Document Content */}
            <div className="space-y-8 font-mono text-xs leading-relaxed text-[var(--text-main)]">
              
              <section className="rotate-1 border-l-2 border-[var(--border-subtle)] pl-4">
                <h2 className="mb-2 text-sm font-semibold text-[var(--text-bright)]">01 / overview</h2>
                <p className="text-[var(--text-muted)]">
                  At <span className="text-[var(--text-bright)]">entro</span>, we respect your digital autonomy. This policy details what telemetry and profile data we collect, how it is stored, and your rights regarding deletion or extraction of your information.
                </p>
              </section>

              <section className="-rotate-1 border-l-2 border-[var(--border-subtle)] pl-4">
                <h2 className="mb-2 text-sm font-semibold text-[var(--text-bright)]">02 / data collection</h2>
                <p className="mb-3 text-[var(--text-muted)]">
                  We gather minimal essential parameters necessary to power your aesthetic identity engine:
                </p>
                <ul className="list-inside list-disc space-y-1 text-[var(--text-muted)]">
                  <li><strong className="text-[var(--text-bright)]">Account Credentials:</strong> Email address and encrypted authentication tokens.</li>
                  <li><strong className="text-[var(--text-bright)]">Profile State:</strong> Your custom slug/handle, title, bio text, theme choices, and bio links.</li>
                  <li><strong className="text-[var(--text-bright)]">Telemetry & Logs:</strong> IP address, browser type, and referrer headers for security verification and link analytics.</li>
                </ul>
              </section>

              <section className="rotate-1 border-l-2 border-[var(--border-subtle)] pl-4">
                <h2 className="mb-2 text-sm font-semibold text-[var(--text-bright)]">03 / usage & storage</h2>
                <p className="text-[var(--text-muted)]">
                  Your data is stored securely using industry-standard database providers (Supabase / PostgreSQL) with strict Row Level Security (RLS) policies. We do not sell, rent, or trade your personal data to third-party ad brokers.
                </p>
              </section>

              <section className="-rotate-1 border-l-2 border-[var(--border-subtle)] pl-4">
                <h2 className="mb-2 text-sm font-semibold text-[var(--text-bright)]">04 / cookies & sessions</h2>
                <p className="text-[var(--text-muted)]">
                  We utilize essential HTTP cookies and local storage exclusively to maintain authenticated session states across system reloads. No invasive tracking or cross-site behavior cookies are utilized.
                </p>
              </section>

              <section className="rotate-1 border-l-2 border-[var(--border-subtle)] pl-4">
                <h2 className="mb-2 text-sm font-semibold text-[var(--text-bright)]">05 / user controls & deletion</h2>
                <p className="text-[var(--text-muted)]">
                  You maintain full rights over your entity parameters. You may modify or permanently purge your account and associated profile links directly through your account dashboard or by submitting a system request.
                </p>
              </section>

            </div>

            {/* Footer Navigation */}
            <div className="mt-12 flex items-center justify-between border-t border-[var(--border-subtle)] pt-6 font-mono text-xs text-[var(--text-muted)] -rotate-1">
              <Link
                href="/"
                className="text-[var(--text-bright)] underline decoration-[var(--color-moss)]/40 hover:text-[var(--color-moss)]"
              >
                ➔ return to entro
              </Link>
              <Link
                href="/terms"
                className="text-[var(--text-muted)] underline decoration-[var(--border-subtle)] hover:text-[var(--text-bright)]"
              >
                terms of service
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}