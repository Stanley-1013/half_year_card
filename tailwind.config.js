/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        'night': {
          50: '#E9F7FF',
          100: '#BFA7FF',
          200: '#7EE7FF',
          300: '#FFB7E1',
          700: '#0B1026',
          800: '#080C1A',
          900: '#050614',
        },
        'starlight': '#E9F7FF',
        'galaxy-purple': '#BFA7FF',
        'galaxy-cyan': '#7EE7FF',
        'galaxy-pink': '#FFB7E1',
      },

      fontFamily: {
        'title': ['"Cinzel"', '"Playfair Display"', 'serif'],
        'body': ['"Inter"', '"Noto Sans TC"', 'sans-serif'],
      },

      backgroundImage: {
        'galaxy-radial': 'radial-gradient(ellipse at center, rgba(191, 167, 255, 0.15) 0%, transparent 70%)',
        'galaxy-radial-cyan': 'radial-gradient(ellipse at center, rgba(126, 231, 255, 0.1) 0%, transparent 60%)',
        'galaxy-radial-pink': 'radial-gradient(ellipse at center, rgba(255, 183, 225, 0.12) 0%, transparent 65%)',
      },

      boxShadow: {
        'glow-sm': '0 0 8px rgba(233, 247, 255, 0.3)',
        'glow': '0 0 16px rgba(233, 247, 255, 0.4)',
        'glow-lg': '0 0 24px rgba(233, 247, 255, 0.5)',
        'glow-purple': '0 0 16px rgba(191, 167, 255, 0.4)',
        'card': '0 8px 32px rgba(5, 6, 20, 0.5)',
      },

      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 16px rgba(233, 247, 255, 0.4)'
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 24px rgba(233, 247, 255, 0.6)'
          },
        },
      },

      zIndex: {
        'background': '-10',
        'galaxy': '-5',
        'content': '10',
        'decoration': '20',
        'ui': '30',
        'modal': '40',
      },
    },
  },

  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass-card': {
          'background': 'rgba(10, 12, 28, 0.55)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(233, 247, 255, 0.1)',
        },
        '.text-glow': {
          'text-shadow': '0 0 8px rgba(233, 247, 255, 0.6)',
        },
        '.text-glow-lg': {
          'text-shadow': '0 0 16px rgba(233, 247, 255, 0.8)',
        },
        '.text-gradient': {
          'background-image': 'linear-gradient(135deg, #E9F7FF 0%, #BFA7FF 100%)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
