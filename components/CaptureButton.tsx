'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { captureScreen, uploadCapture, uploadFile } from '@/lib/screen-capture';
import { cn } from '@/lib/utils';

type CaptureState = 'idle' | 'requesting' | 'uploading' | 'error';

export function CaptureButton() {
  const [state, setState] = useState<CaptureState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleCapture = async () => {
    setErrorMsg('');
    try {
      setState('requesting');
      const blob = await captureScreen();
      setState('uploading');
      const { id } = await uploadCapture(blob);
      router.push(`/processing/${id}`);
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.message.includes('Permission denied')
          ? 'Permissão negada. Use o upload de arquivo abaixo.'
          : 'Erro ao capturar. Tente fazer upload de um arquivo.'
      );
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    try {
      setState('uploading');
      const { id } = await uploadFile(file);
      router.push(`/processing/${id}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao fazer upload.');
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isDisabled = state !== 'idle' && state !== 'error';

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={handleCapture}
        disabled={isDisabled}
        className={cn(
          'relative w-44 h-44 rounded-full flex flex-col items-center justify-center gap-2',
          'bg-gradient-to-br from-primary to-amber',
          'shadow-glow-orange hover:shadow-glow-amber',
          'transition-all duration-300 active:scale-95',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          state === 'error' && 'from-danger to-red-700'
        )}
      >
        {state === 'idle' || state === 'error' ? (
          <>
            <span className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-30" />
            <Camera className="w-10 h-10 text-white z-10" />
            <span className="text-white text-sm font-semibold z-10">
              {state === 'error' ? 'Erro' : 'Capturar Tela'}
            </span>
          </>
        ) : (
          <>
            <Loader2 className="w-10 h-10 text-white animate-spin" />
            <span className="text-white text-sm font-medium">
              {state === 'requesting' ? 'Aguardando...' : 'Enviando...'}
            </span>
          </>
        )}
      </button>

      {errorMsg && (
        <p className="text-danger text-sm text-center max-w-xs">{errorMsg}</p>
      )}

      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-muted text-xs">ou</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isDisabled}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-text-secondary text-sm font-medium hover:border-border-active hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="w-4 h-4" />
        Fazer upload de imagem
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
