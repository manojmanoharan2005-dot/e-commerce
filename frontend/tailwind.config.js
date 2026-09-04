/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F382C', // Deep Forest Green
        accent: '#16A34A',  // Agricultural Fresh Green
        secondary: '#09251D', // Dark Forest
        agri: {
          forest: '#0F382C',
          'forest-dark': '#09251D',
          green: '#16A34A',
          'green-hover': '#15803D',
          'green-light': '#DCFCE7',
          gold: '#D97706',
          'gold-light': '#FEF3C7',
          surface: '#F8FAF9',
          card: '#FFFFFF',
          border: '#E2E8F0',
          dark: '#1E293B',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'ticker': 'ticker 40s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite linear'
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: []
};

