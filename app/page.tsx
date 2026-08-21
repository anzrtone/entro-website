'use client';

import { useState, useEffect, useRef, useMemo, memo, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

/**
 * Reusable card wrapper driven entirely by globals.css classes
 * Enhanced with offset neon backings, hover transforms, and clip shapes.
 */
function ClipCard({
  children,
  clipClass = "clip-shape-1",
  gradient,
  className = "",
  innerClassName = "bg-[var(--bg-surface)] p-6",
}: {
  children: ReactNode;
  clipClass?: string;
  gradient?: string;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`group relative transition-all duration-300 ${className}`}>
      {gradient && (
        <div
          className={`pointer-events-none absolute inset-0 translate-x-3.5 translate-y-3.5 opacity-85 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0 ${clipClass}`}
          style={{ background: gradient }}
        />
      )}
      <div
        className={`relative border border-[var(--border-subtle)] shadow-md transition-all duration-300 group-hover:border-[var(--text-bright)] group-hover:translate-x-3.5 group-hover:translate-y-3.5 group-hover:rotate-0 ${clipClass} ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [handle, setHandle] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handle.trim().toLowerCase();
    const basePath = user ? "/dashboard" : "/signup";
    const destination = cleanHandle
      ? `${basePath}?slug=${encodeURIComponent(cleanHandle)}`
      : basePath;

    router.push(destination);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^a-zA-Z0-9_-]/g, "");
    setHandle(sanitized);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-app)] font-mono text-[var(--text-main)] selection:bg-[var(--color-moss)] selection:text-[var(--bg-app)] scroll-smooth">
      {/* BACKGROUND AMBIENCE */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(var(--text-muted) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none fixed -left-1/3 top-0 z-0 h-[150vh] w-[120vw] -rotate-[12deg] border-r border-[var(--color-moss)]/15" />

      <Header user={user} loadingAuth={loadingAuth} supabase={supabase} />
      <HeroSection
        handle={handle}
        onHandleChange={handleInputChange}
        onClaimSubmit={handleClaimSubmit}
      />
      <StorySection />
      <WorldsSection />
      <PricingSection />
      <Footer />
    </div>
  );
}

/* ============================================================================
   SUB-COMPONENTS
   ============================================================================ */

function Header({
  user,
  loadingAuth,
  supabase,
}: {
  user: User | null;
  loadingAuth: boolean;
  supabase: ReturnType<typeof createClient>;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    router.refresh();
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <header className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-6 py-8 md:px-10">
      <Link href="/" className="group flex items-center gap-3">
        <div className="-rotate-2 logo-box h-7 w-7 border border-[var(--border-subtle)] bg-[var(--color-moss)] opacity-95 transition-transform duration-300 group-hover:-rotate-45" />
        <span className="font-mono text-2xl font-normal tracking-tight text-[var(--text-bright)]">
          entro<span className="text-[var(--text-muted)]">.</span>
        </span>
      </Link>

      <nav className="hidden items-center gap-10 font-mono text-xs tracking-wider text-[var(--text-muted)] md:flex">
        <a href="#story" className="transition-colors hover:text-[var(--color-moss)]">[how_it_works]</a>
        <a href="#worlds" className="transition-colors hover:text-[var(--color-moss)]">[aesthetic_worlds]</a>
        <a href="#pricing" className="transition-colors hover:text-[var(--color-moss)]">[access]</a>
      </nav>

      <div className="flex items-center gap-5">
        {!loadingAuth && (
          <>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="auth-badge relative flex h-8 w-8 cursor-pointer items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-card)] font-mono text-xs text-[var(--text-bright)] transition-all hover:border-[var(--color-moss)] active:scale-95 active:translate-y-0.5"
                  aria-label="Account menu"
                >
                  <span>{userInitial}</span>
                </button>

                {dropdownOpen && (
                  <div className="-rotate-1 absolute right-0 top-11 z-50 shadow-xl">
                    <ClipCard
                      clipClass="clip-shape-1"
                      innerClassName="w-56 space-y-3 bg-[var(--bg-surface)] p-4"
                    >
                      <div className="border-b border-[var(--border-subtle)] pb-3">
                        <p className="font-mono text-[11px] tracking-widest text-[var(--text-muted)]">// signed in as</p>
                        <p className="truncate font-mono text-xs text-[var(--text-bright)]">
                          {user.email}
                        </p>
                      </div>

                      <div className="space-y-1 font-mono text-xs">
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex w-full items-center justify-between px-2 py-1.5 text-[var(--color-slate)] transition-colors hover:bg-[var(--border-subtle)] hover:text-[var(--text-bright)]"
                        >
                          <span>dashboard</span>
                          <span>➔</span>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex w-full items-center justify-between px-2 py-1.5 text-[var(--color-slate)] transition-colors hover:bg-[var(--border-subtle)] hover:text-[var(--text-bright)]"
                        >
                          <span>settings</span>
                        </Link>
                      </div>

                      <div className="border-t border-[var(--border-subtle)] pt-2 font-mono text-xs">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full cursor-pointer items-center justify-between px-2 py-1.5 text-[var(--accent-pink)] transition-colors hover:bg-[var(--border-subtle)]"
                        >
                          <span>log out</span>
                          <span>×</span>
                        </button>
                      </div>
                    </ClipCard>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden font-mono text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-bright)] md:inline"
              >
                log in
              </Link>
            )}
          </>
        )}

        <Link href="/dashboard" className="-rotate-1 studio-btn px-4 py-2 font-mono text-xs text-[var(--text-bright)] active:scale-95 active:translate-y-0.5">
          studio dashboard ➔
        </Link>
      </div>
    </header>
  );
}

function HeroSection({
  handle,
  onHandleChange,
  onClaimSubmit,
}: {
  handle: string;
  onHandleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClaimSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-10">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="space-y-6 text-left lg:col-span-7">
          <div className="-rotate-2 inline-flex items-center gap-2 border-b border-[var(--color-moss)]/40 pb-1">
            <span className="font-mono text-[11px] tracking-widest text-[var(--text-muted)]">// entro.site • aesthetic identity engine</span>
          </div>

          <h1 className="-rotate-1 font-mono text-3xl font-light tracking-tight text-[var(--text-bright)] sm:text-5xl">
            Your personality isn't a list of buttons.
          </h1>

          <p className="rotate-1 font-mono text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
            Stop handing people digital receipts. Host your socials, music, and portfolio
            inside hyper-customizable mini-worlds—from retro operating systems to virtual
            pets and gaming HUDs.
          </p>

          <div className="-rotate-2 relative w-full max-w-xl transition-transform duration-300 hover:rotate-0">
            <ClipCard
              clipClass="clip-input"
              gradient="linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-cyan) 25%, transparent 80%)"
              innerClassName="hero-input-wrapper p-0"
            >
              <form
                onSubmit={onClaimSubmit}
                className="relative flex flex-col gap-2 p-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
              >
                <div className="flex flex-1 items-center pl-3 font-mono text-sm text-[var(--text-muted)]">
                  <label htmlFor="handle-input" className="select-none">
                    entro.site/
                  </label>
                  <input
                    id="handle-input"
                    type="text"
                    value={handle}
                    onChange={onHandleChange}
                    placeholder="yourname"
                    aria-label="Claim your unique handle"
                    className="ml-1 w-full bg-transparent font-mono text-base text-[var(--text-bright)] focus:outline-none"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="primary-action-btn cursor-pointer px-6 py-3 font-mono text-xs font-bold active:scale-[0.97] active:translate-y-0.5"
                >
                  claim world ➔
                </button>
              </form>
            </ClipCard>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5">
          <ClipCard
            className="rotate-3 -translate-y-2"
            clipClass="clip-shape-1"
            gradient="linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-pink) 30%, transparent 85%)"
          >
            <div className="flex justify-between border-b border-[var(--border-subtle)] pb-2 font-mono text-[10px] text-[var(--text-muted)]">
              <span>[LIVE_PREVIEW_ENGINE]</span>
              <span>v2.0</span>
            </div>
            <div className="my-6 space-y-3 font-mono text-xs">
              <div className="-rotate-1 clip-shape-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 text-[var(--text-bright)] transition-colors hover:border-[var(--color-moss)]">
                &gt; loading tamagotchi HUD...
              </div>
              <div className="rotate-1 clip-shape-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 text-[var(--text-muted)] transition-colors hover:border-[var(--accent-cyan)]">
                &gt; windows_xp_wallpaper.png [OK]
              </div>
            </div>
            <div className="text-right font-mono text-[9px] text-[var(--color-moss)]">
              STATUS: READY_TO_BUILD
            </div>
          </ClipCard>
        </div>
      </div>
    </section>
  );
}

const StorySection = memo(function StorySection() {
  return (
    <section id="story" className="relative z-10 mx-auto max-w-6xl space-y-28 px-6 py-16 md:px-10">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="-rotate-1 space-y-4 lg:col-span-6">
          <span className="-rotate-2 clip-shape-1 inline-block border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1 font-mono text-[10px] text-[var(--color-moss)]">
            01 // CHOOSE YOUR WORLD ENGINE
          </span>

          <h2 className="font-mono text-2xl font-light text-[var(--text-bright)] sm:text-3xl">
            Don't just pick a theme. Pick a whole universe.
          </h2>

          <p className="font-mono text-xs leading-relaxed text-[var(--color-slate)]">
            Whether it's a retro Windows XP desktop with draggable windows, a 90s handheld
            Tamagotchi, or a Minecraft loading screen—your bio link starts as an immersive
            interactive engine.
          </p>
        </div>
        <div className="lg:col-span-6">
          <ClipCard
            className="-rotate-2 -translate-y-2"
            clipClass="clip-shape-1"
            gradient="linear-gradient(135deg, var(--color-moss) 0%, var(--color-moss) 25%, transparent 75%)"
            innerClassName="bg-[var(--bg-surface)] p-8"
          >
            <div className="font-mono text-xs text-[var(--text-bright)]">Template Engine: Windows XP</div>
            <div className="rotate-1 clip-shape-2 mt-4 flex h-32 items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-[10px] text-[var(--color-moss)] transition-colors hover:border-[var(--color-moss)]">
              [ Draggable Desktop Windows &amp; Custom Icons ]
            </div>
          </ClipCard>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <ClipCard
            className="rotate-2 translate-y-3"
            clipClass="clip-shape-2"
            gradient="linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-cyan) 30%, transparent 80%)"
            innerClassName="bg-[var(--bg-surface)] p-8"
          >
            <div className="font-mono text-xs text-[var(--text-bright)]">Micro-Cosmetic Customizer</div>
            <div className="-rotate-1 clip-shape-3 mt-4 flex h-32 items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-[10px] text-[var(--color-moss)] transition-colors hover:border-[var(--accent-cyan)]">
              [ Taskbars • Banners • Start Buttons • Sound Effects ]
            </div>
          </ClipCard>
        </div>
        <div className="rotate-1 order-1 space-y-4 lg:order-2 lg:col-span-6">
          <span className="rotate-2 clip-shape-2 inline-block border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1 font-mono text-[10px] text-[var(--accent-cyan)]">
            02 // MICRO-COSMETIC CONTROL
          </span>

          <h2 className="font-mono text-2xl font-light text-[var(--text-bright)] sm:text-3xl">
            Customize every detail like a Discord profile shop.
          </h2>

          <p className="font-mono text-xs leading-relaxed text-[var(--color-slate)]">
            Deep aesthetic customization. Change start buttons, wallpaper textures, taskbar
            gradients, audio players, custom fonts, and custom desktop icons.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="-rotate-1 space-y-4 lg:col-span-6">
          <span className="-rotate-2 clip-shape-3 inline-block border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1 font-mono text-[10px] text-[var(--accent-pink)]">
            03 // STEP INTO YOUR WORLD
          </span>

          <h2 className="font-mono text-2xl font-light text-[var(--text-bright)] sm:text-3xl">
            When visitors land, they step into your vibe.
          </h2>

          <p className="font-mono text-xs leading-relaxed text-[var(--color-slate)]">
            No more boring scrolling down identical link trees. Give your fans and clients
            an unforgettable interactive experience every time they click your bio.
          </p>
        </div>
        <div className="lg:col-span-6">
          <ClipCard
            className="-rotate-2 -translate-y-1"
            clipClass="clip-shape-3"
            gradient="linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-pink) 25%, transparent 75%)"
            innerClassName="bg-[var(--bg-surface)] p-8"
          >
            <div className="font-mono text-xs text-[var(--text-bright)]">Live Visitor Experience</div>
            <div className="rotate-1 clip-shape-1 mt-4 flex h-32 items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-[10px] text-[var(--color-moss)] transition-colors hover:border-[var(--accent-pink)]">
              [ Interactive Audio + Custom Social World ]
            </div>
          </ClipCard>
        </div>
      </div>
    </section>
  );
});

const WorldsSection = memo(function WorldsSection() {
  return (
    <section id="worlds" className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:px-10">
      <div className="rotate-1 mb-12 space-y-2 text-center">
        <p className="font-mono text-xs text-[var(--text-muted)]">// world engines</p>
        <h2 className="font-mono text-2xl font-light text-[var(--text-bright)] sm:text-3xl">
          Choose your aesthetic foundation.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <WorldCard
          className="rotate-1 -translate-y-2"
          code="TEMPLATE_01"
          title="Windows XP Desktop"
          tag="OS Simulator"
          description="Fully draggable windows, taskbar cosmetics, custom start menu, wallpapers, and app icons."
          neonColor="var(--accent-cyan)"
          clipClass="clip-shape-1"
        />
        <WorldCard
          className="-rotate-2 translate-y-3"
          code="TEMPLATE_02"
          title="Pocket Virtual Pet"
          tag="Tamagotchi UI"
          description="Encapsulate your bio inside a 90s handheld virtual pet with custom stats and pet moods."
          neonColor="var(--accent-pink)"
          clipClass="clip-shape-2"
        />
        <WorldCard
          className="rotate-2 -translate-y-1"
          code="TEMPLATE_03"
          title="Minecraft Block HUD"
          tag="Gamer UI"
          description="Inventory grid link slots, custom pixel art banners, health bar bio stats, and loading screens."
          neonColor="var(--color-moss)"
          clipClass="clip-shape-3"
        />
      </div>
    </section>
  );
});

function WorldCard({
  code,
  title,
  tag,
  description,
  neonColor = "var(--accent-cyan)",
  clipClass = "clip-shape-1",
  className = "",
}: {
  code: string;
  title: string;
  tag: string;
  description: string;
  neonColor?: string;
  clipClass?: string;
  className?: string;
}) {
  return (
    <ClipCard
      className={className}
      clipClass={clipClass}
      gradient={`linear-gradient(135deg, ${neonColor} 0%, ${neonColor} 20%, transparent 75%)`}
      innerClassName="flex flex-col justify-between space-y-6 bg-[var(--bg-surface)] p-8"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-[var(--text-muted)]">[ {code} ]</span>
        <span className="-rotate-1 clip-shape-1 block border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2 py-0.5 font-mono text-[0.6rem] text-[var(--text-muted)] select-none">
          {tag}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-mono text-xl font-normal text-[var(--text-bright)]">{title}</h3>
        <p className="font-mono text-xs leading-relaxed text-[var(--color-slate)]">
          {description}
        </p>
      </div>

      <div className="rotate-1 clip-shape-2 flex h-24 flex-col justify-between border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 font-mono text-[10px] text-[var(--color-slate)] transition-colors hover:border-[var(--text-bright)]">
        <div className="flex justify-between border-b border-[var(--border-subtle)] pb-1">
          <span>custom cosmetics</span>
          <span className="text-[var(--color-moss)]">active</span>
        </div>
        <div className="space-y-1">
          <div className="h-1.5 w-3/4 bg-[var(--border-subtle)]" />
          <div className="h-1.5 w-1/2 bg-[var(--border-subtle)]" />
        </div>
      </div>
    </ClipCard>
  );
}

const PricingSection = memo(function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 mx-auto max-w-5xl px-6 py-20 md:px-10">
      <div className="-rotate-1 mb-16 space-y-2 text-center">
        <p className="font-mono text-xs text-[var(--text-muted)]">// access options</p>
        <h2 className="font-mono text-2xl font-light text-[var(--text-bright)]">
          Simple, transparent access.
        </h2>
      </div>

      <div className="mx-auto grid max-w-3xl grid-cols-1 items-start gap-10 md:grid-cols-2">
        <ClipCard
          className="-rotate-2 -translate-y-2"
          clipClass="clip-shape-1"
          gradient="linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-cyan) 30%, transparent 80%)"
          innerClassName="space-y-6 bg-[var(--bg-surface)] p-8"
        >
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-[var(--accent-cyan)]">// a la carte</p>
            <h3 className="font-mono text-base font-normal text-[var(--text-bright)]">
              Single World Template
            </h3>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-light text-[var(--text-bright)]">$0.99</span>
            <span className="font-mono text-xs text-[var(--text-subtle)]">one-time</span>
          </div>

          <p className="font-mono text-xs leading-relaxed text-[var(--color-slate)]">
            Pick one template engine (e.g. Windows XP or Tamagotchi), bind it to your
            handle, and customize it forever.
          </p>

          <Link
            href="/signup?plan=single"
            className="-rotate-1 clip-shape-1 block w-full cursor-pointer border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2.5 text-center font-mono text-xs text-[var(--text-bright)] transition-all hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] active:scale-95 active:translate-y-0.5"
          >
            claim single world ➔
          </Link>
        </ClipCard>

        <ClipCard
          className="rotate-2 translate-y-4 md:translate-y-6"
          clipClass="clip-shape-2"
          gradient="linear-gradient(135deg, var(--accent-pink) 0%, var(--accent-pink) 35%, transparent 85%)"
          innerClassName="space-y-6 bg-[var(--bg-card)] p-8"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--text-muted)]">entro studio access</span>
            <span className="rotate-1 clip-shape-1 block border border-[var(--border-subtle)] bg-[var(--color-moss)] px-2.5 py-0.5 font-mono text-[0.65rem] font-bold text-[var(--bg-app)] select-none">
              UNLIMITED
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-light text-[var(--text-bright)]">$5.00</span>
            <span className="font-mono text-xs text-[var(--text-subtle)]">/ month</span>
          </div>

          <p className="font-mono text-xs leading-relaxed text-[var(--color-slate)]">
            Instant access to every current and future aesthetic world template, custom
            cosmetic packs, and priority hosting.
          </p>

          <Link
            href="/signup?plan=membership"
            className="rotate-1 primary-action-btn clip-shape-1 block w-full py-2.5 text-center font-mono text-xs font-bold active:scale-95 active:translate-y-0.5"
          >
            get unlimited access ➔
          </Link>
        </ClipCard>
      </div>
    </section>
  );
});

const Footer = memo(function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--border-subtle)] py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 text-xs text-[var(--text-subtle)] md:flex-row md:px-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rotate-1 logo-box h-4 w-4 border border-[var(--border-subtle)] bg-[var(--color-moss)] opacity-95 transition-transform duration-300 hover:-rotate-45" />
            <p className="font-mono text-base font-normal text-[var(--text-bright)]">
              entro<span className="text-[var(--text-muted)]">.</span>
            </p>
          </div>
          <p className="max-w-xs font-mono text-[11px]">
            Experiential personal websites and aesthetic identity engines.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 font-mono">
          <a href="#story" className="transition-colors hover:text-[var(--color-moss)]">how it works</a>
          <a href="#worlds" className="transition-colors hover:text-[var(--color-moss)]">worlds</a>
          <a href="#pricing" className="transition-colors hover:text-[var(--color-moss)]">pricing</a>
          <Link href="/terms" className="underline decoration-[var(--color-moss)]/40 transition-colors hover:text-[var(--text-bright)]">terms of service</Link>
          <Link href="/privacy" className="underline decoration-[var(--color-moss)]/40 transition-colors hover:text-[var(--text-bright)]">privacy policy</Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl justify-between px-6 pt-8 font-mono text-[10px] text-[var(--text-muted)] md:px-10">
        <p>© {new Date().getFullYear()} entro site. all rights reserved.</p>
        <p>[powered by supabase &amp; stripe]</p>
      </div>
    </footer>
  );
});