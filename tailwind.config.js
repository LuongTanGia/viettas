/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'bg-login': "url('/background.jpg')",
      },
      colors: {
        'bg-main': '#2984ff',
        'hover-border-color': '#4897e6',
      },
      fontSize: {
        'text-main': '14px',
        'text-title': ['18px', '24px'],
      },
      fontFamily: {
        'google-sans': ['"Google Sans"', 'arial', 'sans-serif'],
      },
      boxShadow: {
        custom: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
      },
    },
  },
  plugins: [],
}
