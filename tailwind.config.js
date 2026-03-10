/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        surface: {
          DEFAULT: "#0a0a0f",
          card: "rgba(255,255,255,0.03)",
          hover: "rgba(255,255,255,0.06)",
          secondary: "#12121a",
        },
        accent: {
          orange: "#ff9500",
          amber: "#ffb340",
        },
      },
      animation: {
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "spin-slow": "spin 1s linear infinite",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
      },
    },
  },
  plugins: [],
};
