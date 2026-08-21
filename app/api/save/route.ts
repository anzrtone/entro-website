import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, bio, theme, windows, customDomain } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          slug,
          title,
          bio,
          theme,
          windows,
          custom_domain: customDomain,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
