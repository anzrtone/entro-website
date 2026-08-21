import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// ----------------------------------------------------------------------
// 1. GET: Fetch all blocks for a user's profile or slug
// ----------------------------------------------------------------------
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const slug = searchParams.get('slug');

    const supabase = await createClient();

    let targetProfileId = profileId;

    // If slug was passed instead of profileId, lookup profile first
    if (!targetProfileId && slug) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', slug)
        .single();

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      targetProfileId = profile.id;
    }

    if (!targetProfileId) {
      return NextResponse.json({ error: 'profileId or slug is required' }, { status: 400 });
    }

    const { data: blocks, error } = await supabase
      .from('blocks')
      .select('*')
      .eq('profile_id', targetProfileId)
      .order('position', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, blocks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 2. POST: Create a new block or Reorder existing blocks
// ----------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, profileId, type, title, content, position, reorderedBlocks } = body;

    // --- ACTION A: REORDER BLOCKS ---
    if (action === 'reorder' && Array.isArray(reorderedBlocks)) {
      // reorderedBlocks should be an array of { id: string, position: number }
      const updates = reorderedBlocks.map((item) =>
        supabase
          .from('blocks')
          .update({ position: item.position })
          .eq('id', item.id)
      );

      await Promise.all(updates);
      return NextResponse.json({ success: true, message: 'Blocks reordered' });
    }

    // --- ACTION B: ADD NEW BLOCK ---
    if (!profileId || !type) {
      return NextResponse.json(
        { error: 'profileId and type are required to create a block' },
        { status: 400 }
      );
    }

    // Insert new block
    const { data: newBlock, error: insertError } = await supabase
      .from('blocks')
      .insert({
        profile_id: profileId,
        type, // 'link', 'social_grid', 'music_player', 'image', 'custom'
        title: title || 'New Block',
        content: content || {},
        position: position ?? 0,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, block: newBlock });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 3. PUT: Update an existing block (title, content, type)
// ----------------------------------------------------------------------
export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { blockId, title, content, type, position } = body;

    if (!blockId) {
      return NextResponse.json({ error: 'blockId is required' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (title !== undefined) updatePayload.title = title;
    if (content !== undefined) updatePayload.content = content;
    if (type !== undefined) updatePayload.type = type;
    if (position !== undefined) updatePayload.position = position;

    const { data: updatedBlock, error } = await supabase
      .from('blocks')
      .update(updatePayload)
      .eq('id', blockId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, block: updatedBlock });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 4. DELETE: Remove a block
// ----------------------------------------------------------------------
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get('blockId');

    if (!blockId) {
      return NextResponse.json({ error: 'blockId is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('blocks')
      .delete()
      .eq('id', blockId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Block deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
  }
}
