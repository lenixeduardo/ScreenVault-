import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        surface: '#F1F5F9',
        card: '#FFFFFF',
        'card-hover': '#F8FAFC',
        primary: '#F97316',
        'primary-dark': '#EA580C',
        amber: '#FBBF24',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#94A3B8',
        border: 'rgba(0,0,0,0.08)',
        'border-active': 'rgba(249,115,22,0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(251,191,36,0.06) 100%)',
      },
      backdropBlur: {
        glass: '12px',
      },
      boxShadow: {
        'glow-orange': '0 0 40px rgba(249,115,22,0.2)',
        'glow-amber': '0 0 40px rgba(251,191,36,0.2)',
        'glow-green': '0 0 20px rgba(34,197,94,0.2)',
        card: '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 6px 24px rgba(0,0,0,0.14)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
