import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[var(--bg-app)] px-6 py-16 font-mono text-[var(--text-main)] selection:bg-[var(--color-moss)] selection:text-[var(--bg-app)] md:px-12">
      {/* Background Dots */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Ambient Diagonal Rule */}
      <div className="pointer-events-none fixed -left-1/3 top-0 z-0 h-[150vh] w-[120vw] -rotate-[12deg] border-r border-[var(--color-moss)]/15" />

      <div className="relative z-10 w-full max-w-md">
        <div className="group relative">
          {/* Tapered Electric Pink Neon Accent Backing */}
          <div
            className="clip-shape-1 absolute inset-0 translate-x-3.5 translate-y-3.5 -rotate-1 pointer-events-none opacity-85 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0"
            style={{
              background: 'linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-pink) 25%, transparent 80%)',
            }}
          />

          {/* Foreground Card */}
          <div className="clip-shape-1 relative -rotate-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-md transition-all duration-300 hover:border-[var(--text-bright)] hover:translate-x-3.5 hover:translate-y-3.5 hover:rotate-0 md:p-10">
            <div className="mb-6 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <Link href="/" className="group/link flex items-center gap-2.5">
                <div className="-rotate-2 logo-box h-5 w-5 border border-[var(--border-subtle)] bg-[var(--color-moss)] opacity-95 transition-transform duration-300 group-hover/link:-rotate-45" />
                <span className="font-mono text-lg font-normal tracking-tight text-[var(--text-bright)]">
                  entro<span className="text-[var(--text-muted)]">.</span>
                </span>
              </Link>
              <p className="-rotate-1 font-mono text-[11px] tracking-widest text-[var(--accent-pink)]">
                // sys_404
              </p>
            </div>

            <h1 className="rotate-1 mb-4 font-mono text-3xl font-light leading-tight text-[var(--text-bright)] md:text-4xl">
              this handle
              <br />
              doesn&apos;t exist.
            </h1>

            <p className="-rotate-1 mb-10 max-w-xs font-mono text-xs text-[var(--color-slate)]">
              the page you&apos;re looking for hasn&apos;t been claimed, or was removed.
            </p>

            <div className="w-full">
              <Link
                href="/"
                className="-rotate-1 primary-action-btn clip-shape-2 block w-full py-3.5 text-center font-mono text-xs font-bold active:scale-95 active:translate-y-0.5"
              >
                back to entro ➔
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}