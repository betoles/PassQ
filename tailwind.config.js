/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./p.html",
    "./app.html",
    "./privacy.html",
    "./terms.html",
    "./imprint.html",
    "./cookies.html",
    "./compliance-statement.html",
    "./security.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        brand: {
          50: '#ecfdf5',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b'
        }
      }
    }
  },
  plugins: []
};
