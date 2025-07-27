/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // veya kendi klasör yapınıza göre uyarlayın
  ],
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.8s ease-out forwards',
      },
    },
  },
  plugins: [
      require('@tailwindcss/aspect-ratio'),
  ],
}
