/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // lub './index.html' jeśli używasz Vite
  theme: {
    extend: {
      keyframes: {
        "spin-once": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-once": "spin-once 0.5s ease-in-out",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
