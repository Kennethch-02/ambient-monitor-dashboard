/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './embed.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg0: 'var(--bg0)', bg1: 'var(--bg1)', bg1b: 'var(--bg1b)', bg2: 'var(--bg2)',
        line: 'var(--line)', lineSoft: 'var(--line-soft)',
        txt: 'var(--txt)', txt2: 'var(--txt2)', txt3: 'var(--txt3)',
        optimal: 'var(--optimal)', warm: 'var(--warm)', cold: 'var(--cold)',
        amber: 'var(--amber)', cyan: 'var(--cyan)', violet: 'var(--violet)', muted: 'var(--muted)',
      },
      fontFamily: {
        sans: ["'Space Grotesk'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'ui-monospace', 'monospace'],
      },
      borderRadius: { card: '18px', xl2: '20px', hero: '22px' },
      boxShadow: { amb: 'var(--shadow)' },
      maxWidth: { app: '1180px', site: '1120px' },
      keyframes: {
        pulse2: { '0%,100%': { opacity: '.35', transform: 'scale(.85)' }, '50%': { opacity: '1', transform: 'scale(1.1)' } },
        ring: { '0%': { opacity: '.6', transform: 'scale(.6)' }, '70%': { opacity: '0' }, '100%': { opacity: '0', transform: 'scale(2.4)' } },
        breathe: { '0%,100%': { opacity: '.5' }, '50%': { opacity: '.9' } },
        spin2: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        pulse2: 'pulse2 2s ease-in-out infinite',
        ring: 'ring 1.8s ease-out infinite',
        breathe: 'breathe 6s ease-in-out infinite',
        spin2: 'spin2 .9s linear infinite',
      },
    },
  },
  plugins: [],
}
