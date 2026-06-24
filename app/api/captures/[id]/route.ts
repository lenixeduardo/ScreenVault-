import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseAdmin
    .from('captures')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Capture not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const allowedFields = ['title', 'summary', 'category', 'tags', 'is_important'];
    const patch = Object.fromEntries(
      Object.entries(body).filter(([k]) => allowedFields.includes(k))
    );

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('captures')
      .update(patch)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: capture } = await supabaseAdmin
      .from('captures')
      .select('image_path')
      .eq('id', params.id)
      .single();

    if (capture?.image_path) {
      await supabaseAdmin.storage.from('captures').remove([capture.image_path]);
    }

    const { error } = await supabaseAdmin.from('captures').delete().eq('id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}