'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Check } from 'lucide-react';
import { toast } from 'sonner';

export function SaveButton() {
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    setSaved(true);
    toast.success('Captura salva no dashboard!');
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <button
      onClick={handleSave}
      disabled={saved}
      className="btn-primary flex-1 justify-center"
    >
      {saved ? (
        <><Check className="w-4 h-4" />Salvo!</>
      ) : (
        <><Save className="w-4 h-4" />Salvar no dashboard</>
      )}
    </button>
  );
}