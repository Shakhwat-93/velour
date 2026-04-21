/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Brand Palette
        'brand-gold':    '#C9A472',
        'brand-gold-light': '#E4C99A',
        'brand-gold-dark':  '#9A7430',
        
        // Semantic System
        'bg-primary':    '#FAFAF8',
        'bg-secondary':  '#F5EDE6',
        'bg-dark':       '#0B131B',
        'surface':       '#FFFFFF',
        
        'text-primary':  '#1A1A1A',
        'text-muted':    '#7A7A7A',
        'text-on-dark':  '#FFFFFF',
        
        'border-light':  '#E8E0D8',
        'border-subtle': 'rgba(26, 26, 26, 0.08)',
        'border-gold':   'rgba(201, 164, 114, 0.3)',

        // Legacy / Misc
        'hero':      '#0F1923',
        'accent':    '#C9A472',
        'card':      '#F5EDE6',
        'bar':       '#E8C4B0',
        'site-bg':   '#FAFAF8',
        'star':      '#D4A017',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '4.5': '18px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },
      borderRadius: {
        'pill': '9999px',
        '2xl':  '1rem',
        '3xl':  '1.5rem',
        '4xl':  '2rem',
        '5xl':  '2.5rem',
      },
      boxShadow: {
        'gold':      '0 8px 24px rgba(201,164,114,0.15)',
        'gold-hover':'0 12px 32px rgba(201,164,114,0.25)',
        'card':      '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover':'0 12px 40px rgba(0,0,0,0.14)',
        'premium':   '0 20px 48px rgba(0,0,0,0.16)',
      },
      animation: {
        'fade-up': 'fadeUp 0.42s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.3s ease both',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}

