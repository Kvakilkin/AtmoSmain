/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atmos: {
          dark: '#0A0A0C',
          surface: '#121214',
          card: '#18181C',
          cardHover: '#202026',
          border: '#282830',
          orange: '#FF5500',
          orangeHover: '#FF6A00',
          orangeBright: '#FF8800',
          orangeMuted: 'rgba(255, 85, 0, 0.15)',
          cyan: '#00E5FF',
          cyanMuted: 'rgba(0, 229, 255, 0.15)',
          muted: '#A1A1AA',
          subtle: '#71717A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-orbitron)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-orange': '0 0 25px -3px rgba(255, 85, 0, 0.5), 0 0 10px -2px rgba(255, 85, 0, 0.3)',
        'neon-cyan': '0 0 25px -3px rgba(0, 229, 255, 0.5), 0 0 10px -2px rgba(0, 229, 255, 0.3)',
        'neon-glow': '0 0 40px -5px rgba(255, 85, 0, 0.35)',
        'card-glow': '0 4px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'atmos-gradient': 'linear-gradient(135deg, #FF5500 0%, #121214 60%, #0A0A0C 100%)',
        'atmos-card': 'linear-gradient(180deg, rgba(255, 85, 0, 0.06) 0%, rgba(24, 24, 28, 0.95) 30%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
