import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { analyzeImage } from '@/lib/anthropic';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mediaType = file.type || 'image/jpeg';

    const ext = mediaType.split('/')[1] || 'jpg';
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const storagePath = `captures/${filename}`;

    const { error: storageError } = await supabaseAdmin.storage
      .from('captures')
      .upload(storagePath, buffer, { contentType: mediaType, upsert: false });

    if (storageError) {
      console.error('Storage upload error:', storageError);
      return NextResponse.json({ error: `Storage error: ${storageError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from('captures').getPublicUrl(storagePath);

    const analysis = await analyzeImage(base64, mediaType);

    const { data, error: dbError } = await supabaseAdmin
      .from('captures')
      .insert({
        image_url: publicUrl,
        image_path: storagePath,
        title: analysis.title,
        summary: analysis.summary,
        extracted_text: analysis.extracted_text,
        category: analysis.category,
        tags: analysis.tags,
        metadata: analysis.metadata,
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
      await supabaseAdmin.storage.from('captures').remove([storagePath]);
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('POST /api/captures error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const important = searchParams.get('important');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');

    let query = supabaseAdmin
      .from('captures')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (important === 'true') {
      query = query.eq('is_important', true);
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,extracted_text.ilike.%${search}%,summary.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [], count: count ?? 0, limit, offset });
  } catch (err) {
    console.error('GET /api/captures error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}