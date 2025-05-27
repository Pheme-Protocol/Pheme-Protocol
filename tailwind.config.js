// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
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
        }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'fadeIn': 'fadeIn 0.2s ease-out',
        'message-in': 'message-fade-in 0.5s ease forwards',
        'fade-in': 'fade-in 0.3s ease-in-out'
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
        }
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
