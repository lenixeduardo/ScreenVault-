import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ExportMenu } from '@/components/ExportMenu';
import { CaptureActions } from './CaptureActions';
import type { Capture } from '@/types';

export default async function CaptureDetailPage({ params }: { params: { id: string } }) {
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
          <Link href="/dashboard" className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />Dashboard
          </Link>
          <ExportMenu capture={capture} pdfElementId="capture-detail-content" />
        </header>

        <div id="capture-detail-content" className="space-y-4">
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
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <CategoryBadge category={capture.category} size="md" />
                  {capture.is_important && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                </div>
                <h1 className="text-xl font-bold text-text-primary">{capture.title}</h1>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{capture.summary}</p>
            <div className="flex items-center gap-1.5 text-text-muted text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(capture.created_at), "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</span>
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
          </div>

          {metadataEntries.length > 0 && (
            <div className="card-base p-5">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Dados detectados pela IA</p>
              <div className="space-y-2">
                {metadataEntries.map(([key, values]) => (
                  <div key={key} className="flex items-start gap-3">
                    <span className="text-xs text-text-muted capitalize min-w-20 font-medium">{key}:</span>
                    <div className="flex flex-wrap gap-1">
                      {(values as string[]).map((v, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-lg">{v}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {capture.extracted_text && (
            <div className="card-base p-5">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Texto completo extraído (OCR)</p>
              <pre className="text-text-secondary text-xs leading-relaxed whitespace-pre-wrap font-mono bg-surface rounded-xl p-3 max-h-72 overflow-y-auto scrollbar-hide">
                {capture.extracted_text}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-4"><CaptureActions capture={capture} /></div>
      </div>
    </main>
  );
}