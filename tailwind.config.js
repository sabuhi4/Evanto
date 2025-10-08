export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5D9BFC',
          hover: '#4A8BFC',
          light: '#93C5FD',
          dark: '#2563EB',
        },
        secondary: '#1C2039',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'candal': ['Candal', 'Poppins', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};