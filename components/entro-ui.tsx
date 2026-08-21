import Link from 'next/link';

export const CLIPS = {
  1: 'polygon(0% 1%, 98% 0%, 100% 97%, 2% 100%)',
  2: 'polygon(2% 0%, 100% 2%, 98% 100%, 0% 98%)',
  3: 'polygon(1% 2%, 99% 0%, 97% 99%, 0% 97%)',
} as const;

const ACCENTS = {
  pink: 'var(--accent-pink)',
  cyan: 'var(--accent-cyan)',
  green: 'var(--accent-green)',
} as const;

export function BgDots() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]"
      style={{ backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
    />
  );
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <div style={{ filter: 'drop-shadow(2px 2px 0px var(--border-dark))' }}>
        <div
          className="h-5 w-5 border border-[var(--border-dark)] bg-[var(--color-moss)] opacity-95 transition-transform duration-300 group-hover:-rotate-45"
          style={{ clipPath: 'polygon(0% 0%, 100% 25%, 75% 100%, 0% 75%)' }}
        />
      </div>
      <span className="font-mono text-lg font-normal tracking-tight text-[var(--text-bright)]">
        entro<span className="text-[var(--text-muted)]">.</span>
      </span>
    </Link>
  );
}

export function CardHeader({ tag }: { tag: string }) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
      <Logo />
      <p className="font-mono text-[11px] tracking-widest text-[var(--text-muted)]">[{tag}]</p>
    </div>
  );
}

/** Asymmetric card: offset accent-gradient backdrop + clipped border card that
 * straightens on hover. variant selects one of the 3 Entro clip shapes. */
export function EntroCard({
  variant = 1,
  accent = 'cyan',
  rotate = -1,
  className = '',
  children,
}: {
  variant?: 1 | 2 | 3;
  accent?: keyof typeof ACCENTS;
  rotate?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const clip = CLIPS[variant];
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute inset-0 translate-x-3 translate-y-3 opacity-85 pointer-events-none"
        style={{ clipPath: clip, background: `linear-gradient(135deg, ${ACCENTS[accent]} 0%, ${ACCENTS[accent]} 25%, transparent 80%)` }}
      />
      <div
        className="relative border-2 border-[var(--border-dark)] bg-[var(--bg-surface)] shadow-[10px_10px_0px_var(--border-dark)] transition-transform duration-300 hover:rotate-0"
        style={{ clipPath: clip, transform: `rotate(${rotate}deg)` }}
      >
        {children}
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block font-mono text-xs text-[var(--text-subtle)]">{children}</label>;
}

export function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 border-2 border-[var(--border-dark)] border-l-4 border-l-[var(--accent-pink)] bg-[var(--bg-card)] px-4 py-3 font-mono text-xs text-[var(--text-muted)] shadow-[4px_4px_0px_var(--border-dark)]">
      {children}
    </div>
  );
}
