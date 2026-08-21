# entro restyle — drop-in files

These are restyled versions of the files you sent, matched to your real
stack (Next 16.2.12, React 19.2.4, Tailwind v4, `@supabase/ssr`). Every
Supabase call, redirect, and handler is untouched — only JSX/className
changed, plus two small additions noted below.

## Drop these in (overwrite):

- `app/page.tsx` — new marketing landing page (root route). You didn't
  have one in what you sent, so this is new, not a replacement.
- `app/layout.tsx` — new visual shell. Swapped Geist → Manrope / Newsreader
  italic / JetBrains Mono. Metadata title/description updated — change
  those two lines if you want different copy.
- `app/globals.css` — **new file**, replace whatever you have now. This is
  Tailwind v4 CSS-first config (`@theme` block), not a JS/TS config file.
  If you had a `tailwind.config.ts`, it's no longer needed for these
  tokens — v4 reads theme straight from this CSS file.
- `app/login/page.tsx` — same `handleLogin`, restyled.
- `app/signup/page.tsx` — same `handleSignUp`/slug-check logic, restyled.
  **One addition**: it now reads `?slug=` from the URL and prefills the
  slug field, so the landing page's handle box can hand off into it. Also
  wrapped in `<Suspense>` because `useSearchParams` requires that in a
  client component — this is a Next.js requirement, not a stylistic
  choice, and the build fails without it.
- `app/[slug]/page.tsx` — same profile/blocks fetch, same theme-mapper
  object (`retro`, `cyberpunk`, `sleek` still work exactly as before) —
  only the `default` theme's markup changed to the entro look.
- `app/terms/page.tsx`, `app/privacy/page.tsx` — new static pages, no
  logic, placeholder legal copy. Replace the copy with your actual terms
  before launch — this is not legal advice.
- `app/not-found.tsx` — new styled 404. Your `[slug]/page.tsx` already
  calls `notFound()` for invalid handles; without this file that falls
  through to Next's plain default 404 page.

## Do NOT touch — no design in these, pure logic:

- `middleware.ts`
- `utils/supabase/client.ts`, `utils/supabase/server.ts`
- `app/auth/callback/route.ts`, `app/auth/signout/route.ts`
- `package.json`, `package-lock.json`
- `next.config.js`

I didn't change any of these and there's nothing to merge — keep your
existing copies exactly as they are.

## Verified

- `tsc --noEmit` passes clean against your real dependency versions
  (Next 16.2.12, React 19.2.4, Tailwind v4).
- A full `next build` compiles successfully — all five routes
  (`/`, `/login`, `/signup`, `/[slug]`, `/_not-found`) build correctly,
  Tailwind v4's `@theme` tokens generate the expected utilities
  (`bg-abyss`, `text-bone`, etc.), and the clip-path geometry renders as
  CSS, no JS needed for it.
- I could not verify the *font-loading* step itself in my sandbox (no
  outbound access to Google Fonts here) — that step is identical to any
  `next/font/google` usage and will resolve the moment you build with
  normal network access, locally or on Cloudflare.

## One thing to check yourself

`app/[slug]/page.tsx` assumes your `profiles` table has a `theme` column
with values like `'default' | 'retro' | 'cyberpunk' | 'sleek'` — that's
lifted straight from your original file, unchanged. If that's not
actually your schema, the `isEntroTheme` check will still work correctly
(it just checks for `'default'`/empty), but double check the other three
theme strings still match what you store.
