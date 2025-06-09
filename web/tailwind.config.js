// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        orbitron: ['var(--font-orbitron)'],
        mono: ['var(--font-fira-mono)'],
      },
      colors: {
        primary: {
          light: '#1a4bbd',
          dark: '#82b4ff',
          hover: {
            light: '#153c97',
            dark: '#a3c7ff',
          }
        },
        background: {
          light: '#ffffff',
          dark: '#0a0f1d',
        },
        surface: {
          light: '#f8fafc',
          dark: '#141e33',
        },
        text: {
          light: '#0a0f1d',
          dark: '#ffffff',
          muted: {
            light: '#1f2937',
            dark: '#e2e8f0',
          },
          placeholder: {
            light: '#4b5563',
            dark: '#9ca3af',
          }
        },
        error: {
          light: '#b91c1c',
          dark: '#fca5a5',
          text: {
            light: '#991b1b',
            dark: '#fee2e2',
          }
        },
        success: {
          light: '#047857',
          dark: '#6ee7b7',
          text: {
            light: '#065f46',
            dark: '#d1fae5',
          }
        },
        border: {
          light: '#e5e7eb',
          dark: '#1f2937',
        },
        'primary-light': '#3B82F6',
        'primary-dark': '#60A5FA',
        'background-light': '#FFFFFF',
        'background-dark': '#1A1A1A',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'fadeIn': 'fadeIn 0.2s ease-out',
        'message-in': 'message-fade-in 0.5s ease forwards',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-25%)',
          },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'message-fade-in': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        typing: {
          '0%': { opacity: '0.2' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        }
      },
      typography: {
        DEFAULT: {
          css: {
            'max-width': 'none',
            color: 'inherit',
            p: {
              marginTop: '1em',
              marginBottom: '1em',
            },
            'ul > li': {
              paddingLeft: '1.5em',
              position: 'relative',
            },
            'ul > li::before': {
              content: '""',
              width: '0.5em',
              height: '0.5em',
              borderRadius: '50%',
              position: 'absolute',
              left: 0,
              top: '0.5em',
              backgroundColor: 'currentColor',
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            hr: {
              borderColor: 'inherit',
              opacity: '0.3',
            },
            code: {
              color: 'inherit',
              fontWeight: '500',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
