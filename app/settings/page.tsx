'use client';

import { useState, useEffect } from 'react';
import { Shield, Monitor, Trash2, Download, Bell, Lock, ChevronRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Settings {
  captureMode: 'screen' | 'upload';
  notifications: boolean;
  retentionDays: number;
}

const DEFAULT_SETTINGS: Settings = { captureMode: 'screen', notifications: true, retentionDays: 0 };

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('screenvault-settings');
      if (stored) setSettings(JSON.parse(stored));
    } catch {}
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem('screenvault-settings', JSON.stringify(next));
    toast.success('Configuração salva');
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4">
        <header className="pt-14 pb-6">
          <h1 className="text-2xl font-bold text-text-primary">Configurações</h1>
          <p className="text-text-muted text-sm">Gerencie privacidade e preferências</p>
        </header>

        <div className="card-base p-4 mb-6 border-success/20 bg-success/5">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-success text-sm font-semibold mb-1">Sua privacidade é prioridade</p>
              <p className="text-text-secondary text-xs leading-relaxed">
                O ScreenVault AI <strong>nunca captura</strong> sua tela automaticamente. Cada
                captura é iniciada explicitamente por você, com confirmação do sistema operacional.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-base overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Monitor className="w-4 h-4 text-text-muted" />
              <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Captura</span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="flex-1">
                <p className="text-text-primary text-sm font-medium">Modo de captura padrão</p>
                <p className="text-text-muted text-xs mt-0.5">{settings.captureMode === 'screen' ? 'Captura de tela nativa' : 'Upload de arquivo'}</p>
              </div>
              <div className="flex gap-2">
                {(['screen', 'upload'] as const).map((mode) => (
                  <button key={mode} onClick={() => updateSetting('captureMode', mode)}
                    className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                      settings.captureMode === mode ? 'bg-primary text-white border-primary' : 'border-border text-text-muted hover:border-border-active'
                    )}>
                    {mode === 'screen' ? 'Tela' : 'Upload'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card-base overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Bell className="w-4 h-4 text-text-muted" />
              <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Notificações</span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="flex-1">
                <p className="text-text-primary text-sm font-medium">Notificações de processamento</p>
                <p className="text-text-muted text-xs mt-0.5">Avisar quando a análise estiver pronta</p>
              </div>
              <div onClick={() => updateSetting('notifications', !settings.notifications)}
                className={cn('w-11 h-6 rounded-full cursor-pointer transition-colors relative', settings.notifications ? 'bg-primary' : 'bg-surface border border-border')}>
                <div className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-transform', settings.notifications ? 'translate-x-6' : 'translate-x-1')} />
              </div>
            </div>
          </div>

          <div className="card-base overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Lock className="w-4 h-4 text-text-muted" />
              <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Privacidade</span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="flex-1">
                <p className="text-text-primary text-sm font-medium">Exclusão automática</p>
                <p className="text-text-muted text-xs mt-0.5">{settings.retentionDays === 0 ? 'Nunca excluir automaticamente' : `Após ${settings.retentionDays} dias`}</p>
              </div>
              <select value={settings.retentionDays} onChange={(e) => updateSetting('retentionDays', Number(e.target.value))}
                className="bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-primary">
                <option value={0}>Nunca</option>
                <option value={7}>7 dias</option>
                <option value={30}>30 dias</option>
                <option value={90}>90 dias</option>
              </select>
            </div>
          </div>

          <div className="card-base overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Download className="w-4 h-4 text-text-muted" />
              <span className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Exportação</span>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="flex-1">
                <p className="text-text-primary text-sm font-medium">Exportar todas as capturas</p>
                <p className="text-text-muted text-xs mt-0.5">Baixar JSON com todas as capturas</p>
              </div>
              <button onClick={() => window.open('/api/captures?limit=100', '_blank')}
                className="flex items-center gap-1 text-primary text-xs hover:underline">
                Exportar <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="card-base p-4 mt-4 border-danger/20">
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="w-4 h-4 text-danger" />
            <span className="text-danger text-sm font-semibold">Zona de perigo</span>
          </div>
          <p className="text-text-muted text-xs mb-4">Estas ações são permanentes e não podem ser desfeitas.</p>
          <button onClick={() => toast.error('Entre em contato com o suporte para excluir todos os dados.')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-danger/30 text-danger text-sm hover:bg-danger/10 transition-colors">
            <Trash2 className="w-4 h-4" />Excluir todas as capturas
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 py-8 text-text-muted text-xs">
          <Info className="w-3 h-3" />
          ScreenVault AI v1.0.0 — Desenvolvido com Claude AI
        </div>
      </div>
    </main>
  );
}