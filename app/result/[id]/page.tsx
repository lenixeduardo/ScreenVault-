import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, Tag } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { CategoryBadge } from '@/components/CategoryBadge';
import { SaveButton } from './SaveButton';
import { ExportMenu } from '@/components/ExportMenu';
import type { Capture } from '@/types';

export default async function ResultPage({ params }: { params: { id: string } }) {
  const { data, error } = await supabaseAdmin
    .from('captures')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) notFound();

  const capture = data as Capture;
  const metadataEntries = Object.entries(capture.metadata ?? {}).filter(
    ([, v]) => Array.isArray(v) && (v as unknown[]).length > 0
  );

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4">
        <header className="pt-14 pb-4 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-base font-semibold text-text-primary">Resultado da captura</h1>
          <ExportMenu capture={capture} pdfElementId="capture-result-content" />
        </header>

        <div id="capture-result-content" className="space-y-4">
          <div className="card-base overflow-hidden">
            <div className="relative aspect-video bg-surface">
              <Image
                src={capture.image_url}
                alt={capture.title ?? 'Captura'}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 512px"
                priority
              />
            </div>
          </div>

          <div className="card-base p-5 space-y-4">
            <div className="space-y-2">
              <CategoryBadge category={capture.category} size="md" />
              <h2 className="text-xl font-bold text-text-primary">{capture.title}</h2>
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5">Resumo</p>
              <p className="text-text-secondary text-sm leading-relaxed">{capture.summary}</p>
            </div>
            {capture.tags && capture.tags.length > 0 && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {capture.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface border border-border text-xs text-text-secondary">
                      <Tag className="w-3 h-3" />{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {metadataEntries.length > 0 && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Dados detectados</p>
                <div className="space-y-1.5">
                  {metadataEntries.map(([key, values]) => (
                    <div key={key} className="flex items-start gap-2">
                      <span className="text-xs text-text-muted capitalize min-w-16">{key}:</span>
                      <span className="text-xs text-text-secondary">{(values as string[]).join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {capture.extracted_text && (
            <div className="card-base p-5">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Texto extraído (OCR)</p>
              <pre className="text-text-secondary text-xs leading-relaxed whitespace-pre-wrap font-mono bg-surface rounded-xl p-3 max-h-48 overflow-y-auto scrollbar-hide">
                {capture.extracted_text}
              </pre>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <SaveButton />
          <Link href="/dashboard" className="btn-ghost flex-1 justify-center">
            <LayoutDashboard className="w-4 h-4" />Ver dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}