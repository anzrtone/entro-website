'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Template {
  id: string;
  name: string;
  tag: string;
  description: string;
  accent_color?: string;
}

interface LinkBlock {
  id: string;
  title: string;
  content: { url: string };
}

function DashboardContent() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    twitter: '',
    github: '',
    spotify: '',
  });

  const [blocks, setBlocks] = useState<LinkBlock[]>([]);
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockUrl, setNewBlockUrl] = useState('');
  const [addingBlock, setAddingBlock] = useState(false);

  const [templates, setTemplates] = useState<Template[]>([]);
  const bioRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.style.height = 'auto';
      bioRef.current.style.height = `${bioRef.current.scrollHeight}px`;
    }
  }, [bio, isSidebarOpen]);

  useEffect(() => {
    async function initDashboard() {
      setLoading(true);

      const storedSlug =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('claimed_slug') || ''
          : '';

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirectTo=/editor');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setProfileId(profile.id);
        const activeSlug = storedSlug || profile.slug || user.email?.split('@')[0] || '';
        setSlug(activeSlug);
        setTitle(profile.title || '');
        setBio(profile.bio || '');
        setAvatarUrl(profile.avatar_url || '');
        setSocialLinks(profile.social_links || { instagram: '', twitter: '', github: '', spotify: '' });

        if (storedSlug && typeof window !== 'undefined') {
          sessionStorage.removeItem('claimed_slug');
        }

        const blockRes = await fetch(`/api/blocks?profileId=${profile.id}`);
        const blockData = await blockRes.json();
        if (blockData.success) {
          setBlocks(blockData.blocks || []);
        }
      } else {
        const defaultSlug = storedSlug || user.email?.split('@')[0] || 'user';
        setSlug(defaultSlug);
        setTitle(defaultSlug);
      }

      const { data: templatesData, error: tplError } = await supabase
        .from('templates')
        .select('*');

      if (!tplError && templatesData) {
        setTemplates(templatesData);
      } else {
        setTemplates([]);
      }

      setLoading(false);
    }

    initDashboard();
  }, [router, supabase]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('profiles').upsert(
      {
        user_id: user.id,
        slug: slug.trim(),
        title,
        bio,
        avatar_url: avatarUrl,
        social_links: socialLinks,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    setSaving(false);
    if (error) {
      setSaveMessage(`Error: ${error.message}`);
    } else {
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle.trim() || !newBlockUrl.trim() || !profileId) return;

    setAddingBlock(true);
    const res = await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId,
        type: 'link',
        title: newBlockTitle,
        content: { url: newBlockUrl },
        position: blocks.length,
      }),
    });

    const result = await res.json();
    setAddingBlock(false);

    if (result.success) {
      setBlocks([...blocks, result.block]);
      setNewBlockTitle('');
      setNewBlockUrl('');
    } else {
      alert('Error adding block: ' + (result.error || 'Failed to create block'));
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Delete this link block?')) return;

    const res = await fetch(`/api/blocks?blockId=${blockId}`, { method: 'DELETE' });
    const result = await res.json();

    if (result.success) {
      setBlocks(blocks.filter((b) => b.id !== blockId));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)] font-mono text-xs text-[var(--text-muted)]">
        <p className="animate-pulse tracking-widest">[sys_dash] // initializing engine environment...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-app)] font-mono text-[var(--text-main)] selection:bg-[var(--color-moss)] selection:text-[var(--bg-app)] overflow-x-hidden">
      {/* Background Ambience Dots */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(var(--text-muted) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="pointer-events-none fixed -left-1/3 top-0 z-0 h-[150vh] w-[120vw] -rotate-[12deg] border-r border-[var(--color-moss)]/15" />

      {/* Backdrop overlay for sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-[var(--bg-app)]/80 backdrop-blur-sm transition-opacity cursor-pointer"
        />
      )}

      {/* Config Panel Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-full max-w-md border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto space-y-8 shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[var(--bg-app)] [&::-webkit-scrollbar-thumb]:bg-[var(--border-subtle)]`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-5 -rotate-1">
          <div>
            <p className="font-mono text-[10px] tracking-widest text-[var(--accent-cyan)] uppercase">// config_panel</p>
            <h2 className="font-mono text-base font-medium tracking-tight text-[var(--text-bright)]">profile settings</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="studio-btn clip-shape-1 px-3 py-1.5 text-xs font-mono text-[var(--text-bright)] cursor-pointer"
          >
            ✕ close
          </button>
        </div>

        {saveMessage && (
          <div className="rotate-1">
            <div className="clip-shape-1 border border-[var(--border-subtle)] border-l-4 border-l-[var(--color-moss)] bg-[var(--bg-card)] px-4 py-3 font-mono text-xs text-[var(--color-moss)]">
              {saveMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5 font-mono text-xs">
          <div className="rotate-1">
            <label className="mb-2 block text-[var(--text-muted)] uppercase tracking-wider text-[10px]">[handle / slug]</label>
            <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1 transition-colors focus-within:border-[var(--text-bright)]">
              <div className="flex items-center">
                <span className="text-[var(--text-muted)] select-none pl-2">entro.site/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.replace(/\s+/g, ''))}
                  className="w-full bg-transparent p-2 text-[var(--text-bright)] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="-rotate-1">
            <label className="mb-2 block text-[var(--text-muted)] uppercase tracking-wider text-[10px]">[profile title]</label>
            <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1 transition-colors focus-within:border-[var(--text-bright)]">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent p-2 text-[var(--text-bright)] focus:outline-none"
              />
            </div>
          </div>

          <div className="rotate-1">
            <label className="mb-2 block text-[var(--text-muted)] uppercase tracking-wider text-[10px]">[bio / description]</label>
            <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1 transition-colors focus-within:border-[var(--text-bright)]">
              <textarea
                ref={bioRef}
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="tell your story..."
                className="w-full bg-transparent p-2 text-[var(--text-bright)] placeholder-[var(--text-muted)] focus:outline-none resize-none overflow-hidden"
              />
            </div>
          </div>

          <div className="-rotate-1">
            <label className="mb-2 block text-[var(--text-muted)] uppercase tracking-wider text-[10px]">[avatar url]</label>
            <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1 transition-colors focus-within:border-[var(--text-bright)]">
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-transparent p-2 text-[var(--text-bright)] placeholder-[var(--text-muted)] focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-5 space-y-3 rotate-1">
            <label className="block text-[var(--text-muted)] uppercase tracking-wider text-[10px]">// social accounts</label>
            <div className="grid grid-cols-2 gap-2.5">
              {['instagram', 'twitter', 'github', 'spotify'].map((platform) => (
                <div key={platform} className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-app)] p-1 transition-colors focus-within:border-[var(--text-bright)]">
                  <input
                    type="text"
                    placeholder={platform}
                    value={(socialLinks as Record<string, string>)[platform] || ''}
                    onChange={(e) => setSocialLinks({ ...socialLinks, [platform]: e.target.value })}
                    className="w-full bg-transparent p-2 text-[var(--text-bright)] placeholder-[var(--text-muted)] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 -rotate-1">
            <button
              type="submit"
              disabled={saving}
              className="studio-btn clip-shape-1 w-full py-3 font-mono text-xs text-[var(--text-bright)] cursor-pointer active:scale-[0.97] active:translate-y-0.5"
            >
              {saving ? 'saving profile…' : 'save profile settings ➔'}
            </button>
          </div>
        </form>

        {/* Links section in sidebar */}
        <div className="border-t border-[var(--border-subtle)] pt-6 space-y-5 -rotate-1">
          <p className="font-mono text-xs font-medium text-[var(--text-bright)] uppercase tracking-wider">// link blocks</p>
          <form onSubmit={handleAddBlock} className="space-y-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] p-4 font-mono text-xs clip-shape-1">
            <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
              <input
                type="text"
                placeholder="link title"
                value={newBlockTitle}
                onChange={(e) => setNewBlockTitle(e.target.value)}
                className="w-full bg-transparent p-2 text-[var(--text-bright)] placeholder-[var(--text-muted)] focus:outline-none"
              />
            </div>
            <div className="clip-input border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1">
              <input
                type="url"
                placeholder="https://..."
                value={newBlockUrl}
                onChange={(e) => setNewBlockUrl(e.target.value)}
                className="w-full bg-transparent p-2 text-[var(--text-bright)] placeholder-[var(--text-muted)] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={addingBlock || !newBlockTitle || !newBlockUrl}
              className="studio-btn clip-shape-1 w-full py-2.5 font-mono text-xs text-[var(--text-bright)] cursor-pointer disabled:opacity-50"
            >
              {addingBlock ? 'adding…' : '+ add link block'}
            </button>
          </form>

          <div className="space-y-2.5">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="clip-shape-1 flex items-center justify-between border border-[var(--border-subtle)] bg-[var(--bg-card)] p-3.5 font-mono text-xs transition-colors hover:border-[var(--text-bright)] rotate-1"
              >
                <div className="truncate mr-2">
                  <p className="text-[var(--text-bright)] truncate font-normal">{block.title}</p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">{block.content?.url}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteBlock(block.id)}
                  className="studio-btn clip-shape-1 px-2.5 py-1 text-[10px] font-mono text-[var(--text-bright)] cursor-pointer shrink-0"
                >
                  delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Workspace Layout */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 py-12 space-y-12">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="group/link flex items-center gap-3">
              <div className="logo-box h-7 w-7 border border-[var(--border-subtle)] bg-[var(--color-moss)] opacity-95 transition-transform duration-300 group-hover/link:-rotate-45 -rotate-2" />
              <span className="font-mono text-2xl font-normal tracking-tight text-[var(--text-bright)]">
                entro<span className="text-[var(--text-muted)]">.</span>
              </span>
            </Link>

            <button
              onClick={() => setIsSidebarOpen(true)}
              className="studio-btn clip-shape-1 px-4 py-2 font-mono text-xs text-[var(--text-bright)] cursor-pointer rotate-1"
            >
              ☰ edit profile &amp; links
            </button>
          </div>

          <div className="flex items-center gap-3 -rotate-1">
            {slug && (
              <a
                href={`/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-btn clip-shape-1 px-4 py-2 font-mono text-xs text-[var(--text-bright)] cursor-pointer"
              >
                live page ↗
              </a>
            )}
          </div>
        </header>

        {/* Templates Grid with Trapezoidal Neon Slit Hover FX */}
        <div className="space-y-10 pt-2">
          {templates.length > 0 ? (
            templates.map((tpl, idx) => {
              const isEven = idx % 2 === 0;
              const cardRotation = isEven ? 'rotate-1' : '-rotate-1';
              const textRotation = isEven ? '-rotate-1' : 'rotate-1';

              return (
                <div key={tpl.id} className="relative group">
                  {/* Tapered Neon Backplate */}
                  <div
                    className="clip-shape-2 absolute inset-0 translate-x-3.5 translate-y-3.5 rotate-1 opacity-85 pointer-events-none transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-cyan) 25%, transparent 80%)',
                    }}
                  />

                  <div className="relative transition-all duration-300">
                    <div className={`clip-shape-2 relative ${cardRotation} border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-md transition-all duration-300 hover:border-[var(--text-bright)] hover:translate-x-3.5 hover:translate-y-3.5 hover:rotate-0`}>
                      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                        <h3 className={`font-mono text-lg font-normal tracking-tight text-[var(--text-bright)] ${textRotation}`}>
                          {tpl.name}
                        </h3>
                        <span
                          className={`clip-shape-1 px-3 py-1 font-mono text-[10px] text-[var(--bg-app)] font-bold uppercase select-none ${textRotation}`}
                          style={{
                            backgroundColor: tpl.accent_color || 'var(--color-moss)',
                          }}
                        >
                          [{tpl.tag}]
                        </span>
                      </div>

                      <p className={`my-6 font-mono text-xs text-[var(--color-slate)] leading-relaxed ${textRotation}`}>
                        {tpl.description}
                      </p>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => router.push(`/editor/interactive?template=${tpl.id}`)}
                          className="studio-btn clip-shape-1 px-5 py-3 font-mono text-xs text-[var(--text-bright)] cursor-pointer active:scale-[0.97]"
                        >
                          open template ➔
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="relative group">
              <div
                className="clip-shape-2 absolute inset-0 translate-x-3.5 translate-y-3.5 rotate-1 opacity-85 pointer-events-none transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-cyan) 25%, transparent 80%)',
                }}
              />
              <div className="clip-shape-2 relative rotate-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-12 text-center shadow-md">
                <p className="font-mono text-xs text-[var(--text-muted)] tracking-wider -rotate-1">// no templates active in environment</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-app)] font-mono text-xs text-[var(--text-muted)]">
          <p className="animate-pulse tracking-widest">[sys_dash] // initializing engine environment...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}