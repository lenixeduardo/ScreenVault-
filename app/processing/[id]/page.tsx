'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Camera } from 'lucide-react';
import { ProcessingSteps } from '@/components/ProcessingSteps';

export default function ProcessingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const checkReady = useCallback(async () => {
    try {
      const res = await fetch(`/api/captures/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          router.replace(`/result/${id}`);
        }
      }
    } catch {
      // Retry on next poll
    }
  }, [id, router]);

  useEffect(() => {
    const interval = setInterval(checkReady, 1500);
    return () => clearInterval(interval);
  }, [checkReady]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="glass rounded-3xl p-8 text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center shadow-glow-orange">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-2 rounded-[2rem] bg-primary/20 animate-ping" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-text-primary">Analisando captura</h1>
            <p className="text-text-muted text-sm mt-1">
              Nossa IA está processando sua imagem
            </p>
          </div>

          {/* Steps */}
          <ProcessingSteps />

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="h-1.5 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full gradient-brand rounded-full transition-all duration-1000 animate-pulse"
                style={{ width: '60%' }}
              />
            </div>
            <p className="text-text-muted text-xs">
              Isso pode levar de 5 a 15 segundos...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
