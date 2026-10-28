/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F8F0E3',
        parchment: '#FAF6EE',
        kraft: {
          light: '#DECCA6',
          DEFAULT: '#CDB089',
          dark: '#B08F63',
          border: '#B89B72'
        },
        wood: {
          light: '#7A6B5B',
          DEFAULT: '#5D4F41',
          dark: '#3F342A'
        },
        charcoal: {
          light: '#4A484A',
          DEFAULT: '#262426',
          dark: '#181718'
        },
        forest: {
          light: '#476F4E',
          DEFAULT: '#2F4F35',
          dark: '#1E3523'
        },
        olive: {
          light: '#889B66',
          DEFAULT: '#6D7F4F',
          dark: '#526139'
        },
        terracotta: {
          light: '#CE7451',
          DEFAULT: '#B85C38',
          dark: '#934425'
        },
        sky: {
          light: '#A2C4BE',
          DEFAULT: '#88B0A8',
          dark: '#688F88'
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        stamp: ['"Special Elite"', '"Courier New"', 'monospace']
      },
      boxShadow: {
        'paper': '0 4px 20px -2px rgba(60, 45, 30, 0.12), 0 2px 6px -1px rgba(60, 45, 30, 0.08)',
        'paper-lg': '0 10px 30px -4px rgba(45, 35, 25, 0.18), 0 4px 10px -2px rgba(45, 35, 25, 0.12)',
        'polaroid': '0 8px 24px -4px rgba(35, 25, 15, 0.25), 0 2px 6px rgba(0, 0, 0, 0.1)',
        'stamp': 'inset 0 0 0 1px rgba(184, 92, 56, 0.4), 0 2px 4px rgba(0,0,0,0.06)'
      }
    },
  },
  plugins: [],
}
