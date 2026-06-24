'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Capture } from '@/types';
import { CategoryBadge } from './CategoryBadge';
import { cn } from '@/lib/utils';

interface CaptureCardProps {
  capture: Capture;
  className?: string;
}

export function CaptureCard({ capture, className }: CaptureCardProps) {
  return (
    <Link href={`/capture/${capture.id}`}>
      <div
        className={cn(
          'group bg-card border border-border rounded-2xl overflow-hidden',
          'hover:border-border-active hover:shadow-card-hover',
          'transition-all duration-300 cursor-pointer',
          className
        )}
      >
        <div className="relative h-36 bg-surface overflow-hidden">
          {capture.image_url ? (
            <Image
              src={capture.image_url}
              alt={capture.title ?? 'Captura de tela'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-text-muted text-sm">Sem imagem</span>
            </div>
          )}

          {capture.is_important && (
            <div className="absolute top-2 right-2">
              <div className="bg-yellow-500/20 backdrop-blur-glass rounded-full p-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4 space-y-2.5">
          <p className="text-text-primary font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {capture.title ?? 'Captura sem título'}
          </p>

          <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed">
            {capture.summary ?? 'Sem resumo disponível'}
          </p>

          <div className="flex items-center justify-between pt-0.5">
            <CategoryBadge category={capture.category} />
            <div className="flex items-center gap-1 text-text-muted text-xs">
              <Calendar className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(capture.created_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>

          {capture.tags && capture.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {capture.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-text-muted bg-surface px-1.5 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
              {capture.tags.length > 3 && (
                <span className="text-xs text-text-muted">+{capture.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}