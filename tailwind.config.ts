import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Day pill colors
    'day-monday',
    'day-tuesday',
    'day-wednesday',
    'day-thursday',
    'day-friday',
    'day-saturday',
    'day-sunday',
  ],
  theme: {
    extend: {
      colors: {
        // Primary teal palette
        primary: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
          dark: '#0F766E',
        },
        // Accent warm gold
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        // Complementary accents
        sage: '#84CC16',
        rose: '#F472B6',
        // Light mode colors
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8FAFC',
        'bg-tertiary': '#F1F5F9',
        'text-primary': '#0F172A',
        'text-secondary': '#334155',
        'text-tertiary': '#64748B',
        'border': '#E2E8F0',
        'border-hover': '#CBD5E1',
        // Dark neutrals (for dark mode)
        midnight: '#0F172A',
        'slate-dark': '#1E293B',
        'slate-mid': '#334155',
        'slate-light': '#64748B',
        silver: '#CBD5E1',
        pearl: '#F1F5F9',
        // Day colors - vibrant
        'day-monday': '#6366F1',
        'day-tuesday': '#14B8A6',
        'day-wednesday': '#F59E0B',
        'day-thursday': '#A855F7',
        'day-friday': '#EC4899',
        'day-saturday': '#3B82F6',
        'day-sunday': '#EF4444',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)',
        'soft-lg': '0 10px 40px -15px rgba(0, 0, 0, 0.4)',
        'glow-primary': '0 0 20px rgba(13, 148, 136, 0.4)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.4)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
export default config
