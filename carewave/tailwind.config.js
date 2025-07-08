/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'hospital-teal': '#0f4c4c',
        'hospital-teal-light': '#175757',
        'hospital-teal-lighter': '#1f6363',
        'hospital-accent': '#0891b2',
        'hospital-success': '#059669',
        'hospital-warning': '#d97706',
        'hospital-error': '#dc2626',
        'hospital-gray-50': '#f8fafc',
        'hospital-gray-100': '#f1f5f9',
        'hospital-gray-200': '#e2e8f0',
        'hospital-gray-300': '#cbd5e1',
        'hospital-gray-400': '#94a3b8',
        'hospital-gray-500': '#64748b',
        'hospital-gray-600': '#475569',
        'hospital-gray-700': '#334155',
        'hospital-gray-800': '#1e293b',
        'hospital-gray-900': '#0f172a',
        'hospital-white': '#ffffff',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        primary: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', '"Open Sans"', '"Helvetica Neue"', 'sans-serif'],
        mono: ['Fira Code', '"Source Code Pro"', 'monospace'],
      },
      transitionDuration: {
        fast: '200ms',
        normal: '300ms',
      },
      transitionTimingFunction: {
        'ease': 'ease',
        'ease-in-out': 'ease-in-out',
      },
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
    },
  },
  plugins: [],
  darkMode: 'media',
}