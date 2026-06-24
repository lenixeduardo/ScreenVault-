import Link from 'next/link';
import { ArrowRight, Camera, Brain, FolderOpen, Shield, Zap, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-amber/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-lg mx-auto px-6 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8">
            <Zap className="w-3 h-3" />
            Powered by Claude AI
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl gradient-brand flex items-center justify-center shadow-glow-orange">
              <Camera className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Screen<span className="gradient-text">Vault</span> AI
          </h1>

          <h2 className="text-xl font-semibold text-text-secondary mb-4">
            Capture. Extraia. Organize.
          </h2>

          <p className="text-text-secondary leading-relaxed text-sm max-w-sm mx-auto">
            Tire um print, nossa IA extrai textos, dados e insights automaticamente — tudo organizado
            em um dashboard inteligente.
          </p>
        </header>

        {/* Mock preview card */}
        <div className="glass rounded-3xl p-4 mb-8 animate-float shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-success text-xs font-medium">IA analisando...</span>
          </div>
          <div className="bg-surface rounded-xl p-3 space-y-2">
            <div className="flex items-start gap-3">
              <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 bg-primary/30 rounded-full w-3/4" />
                <div className="h-2 bg-black/8 rounded-full w-full" />
                <div className="h-2 bg-black/8 rounded-full w-2/3" />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Financeiro
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                R$ 1.234
              </span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: Camera, label: 'Captura fácil', desc: 'Um clique e pronto' },
            { icon: Brain, label: 'IA inteligente', desc: 'OCR + categorização' },
            { icon: FolderOpen, label: 'Organizado', desc: '8 categorias automáticas' },
            { icon: Search, label: 'Busca rápida', desc: 'Por texto e categoria' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="card-base p-4 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <p className="text-text-primary text-sm font-medium">{label}</p>
              <p className="text-text-muted text-xs">{desc}</p>
            </div>
          ))}
        </div>

        {/* Privacy notice */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-success/5 border border-success/20 mb-8">
          <Shield className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
          <p className="text-success text-xs leading-relaxed">
            <strong>Privacidade em primeiro lugar.</strong> A captura só acontece quando{' '}
            <strong>você</strong> solicita. Nenhuma imagem é capturada automaticamente.
          </p>
        </div>

        {/* CTAs */}
        <div className="space-y-3 pb-12">
          <Link
            href="/home"
            className="btn-primary w-full text-base py-4 rounded-2xl justify-center"
          >
            Começar agora
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/dashboard"
            className="btn-ghost w-full text-base py-4 rounded-2xl justify-center"
          >
            Ver dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
