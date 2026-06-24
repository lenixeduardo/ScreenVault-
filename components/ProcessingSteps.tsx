'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 0, label: 'Captura recebida', sublabel: 'Imagem processada com sucesso', durationMs: 800 },
  { id: 1, label: 'OCR em execução', sublabel: 'Extraindo texto da imagem', durationMs: 2200 },
  { id: 2, label: 'Dados extraídos', sublabel: 'Informações identificadas', durationMs: 1600 },
  { id: 3, label: 'Categorias geradas', sublabel: 'Classificação concluída', durationMs: 1000 },
];

interface ProcessingStepsProps {
  onComplete?: () => void;
}

export function ProcessingSteps({ onComplete }: ProcessingStepsProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const advance = (idx: number) => {
      if (cancelled || idx >= STEPS.length) {
        if (!cancelled) onComplete?.();
        return;
      }
      const delay = STEPS[idx]?.durationMs ?? 1000;
      setTimeout(() => {
        if (!cancelled) {
          setActiveStep(idx + 1);
          advance(idx + 1);
        }
      }, delay);
    };

    advance(0);
    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  return (
    <div className="space-y-3">
      {STEPS.map((step) => {
        const isDone = step.id < activeStep;
        const isActive = step.id === activeStep;
        const isPending = step.id > activeStep;

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-4 p-3 rounded-xl transition-all duration-500',
              isDone && 'bg-success/5',
              isActive && 'bg-primary/5',
              isPending && 'opacity-40'
            )}
          >
            <div className="flex-shrink-0">
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-text-muted" />
              )}
            </div>
            <div>
              <p
                className={cn(
                  'text-sm font-medium',
                  isDone && 'text-success',
                  isActive && 'text-primary',
                  isPending && 'text-text-secondary'
                )}
              >
                {step.label}
              </p>
              {(isDone || isActive) && (
                <p className="text-xs text-text-muted mt-0.5">{step.sublabel}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}