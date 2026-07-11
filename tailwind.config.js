/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#070B14",
        surface: "#111827",
        primary: "#00E676",
        primaryHover: "#00C853",
        text: "#F9FAFB",
        muted: "#9CA3AF",
        border: "#1F2937",
        accent: "#3B82F6",
      },

      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },

      borderRadius: {
        xl2: "16px",
        xl3: "24px",
      },
    },
  },

  plugins: [],
};