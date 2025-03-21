/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6', // Blue-500
          foreground: '#ffffff', // White
        },
        secondary: {
          DEFAULT: '#6b7280', // Gray-500
          foreground: '#ffffff', // White
        },
        destructive: {
          DEFAULT: '#ef4444', // Red-500
          foreground: '#ffffff', // White
        },
        muted: {
          DEFAULT: '#f3f4f6', // Gray-100
          foreground: '#6b7280', // Gray-500
        },
        accent: {
          DEFAULT: '#f3f4f6', // Gray-100
          foreground: '#1f2937', // Gray-800
        },
        background: '#ffffff', // White
        foreground: '#1f2937', // Gray-800
        border: '#e5e7eb', // Gray-200
        input: '#e5e7eb', // Gray-200
        ring: '#3b82f6', // Blue-500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};