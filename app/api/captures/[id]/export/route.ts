import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { Capture } from '@/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const format = new URL(req.url).searchParams.get('format') ?? 'markdown';

  const { data: capture, error } = await supabaseAdmin
    .from('captures')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !capture) {
    return NextResponse.json({ error: 'Capture not found' }, { status: 404 });
  }

  const c = capture as Capture;

  if (format === 'markdown') {
    const metadata = c.metadata ?? {};
    const metaLines = Object.entries(metadata)
      .filter(([, v]) => Array.isArray(v) && (v as unknown[]).length > 0)
      .map(([k, v]) => `**${k}:** ${(v as string[]).join(', ')}`);

    const md = [
      `# ${c.title ?? 'Untitled Capture'}`,
      '',
      `> ${c.summary ?? ''}`,
      '',
      `**Category:** ${c.category}`,
      `**Tags:** ${(c.tags ?? []).join(', ')}`,
      `**Captured:** ${new Date(c.created_at).toLocaleString()}`,
      `**Important:** ${c.is_important ? 'Yes' : 'No'}`,
      '',
      '## Extracted Text',
      '',
      c.extracted_text ?? '_No text extracted_',
      ...(metaLines.length > 0 ? ['', '## Metadata', '', ...metaLines] : []),
    ].join('\n');

    return new NextResponse(md, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="screenvault-${params.id}.md"`,
      },
    });
  }

  if (format === 'csv') {
    const headers = ['id', 'title', 'summary', 'category', 'tags', 'is_important', 'created_at'];
    const row = [
      c.id, c.title ?? '', c.summary ?? '',
      c.category, (c.tags ?? []).join('|'),
      c.is_important ? 'true' : 'false', c.created_at,
    ].map((v) => `"${String(v).replace(/"/g, '""""')}"`);

    const csv = [headers.join(','), row.join(',')].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="screenvault-${params.id}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: `Unknown format: ${format}` }, { status: 400 });
}