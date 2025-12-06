/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#7C3AED",
          600: "#6D28D9",
          700: "#5B21B6",
          800: "#4C1D95",
          900: "#3B0764",
        },
        secondary: {
          DEFAULT: "#A78BFA",
          light: "#C4B5FD",
        },
        cta: {
          DEFAULT: "#F43F5E",
          hover: "#E11D48",
        },
        dark: {
          DEFAULT: "#0F0F23",
          100: "#1A1A2E",
          200: "#16213E",
          300: "#1F2937",
          400: "#374151",
        },
        neon: {
          blue: "#0080FF",
          pink: "#FF006E",
          cyan: "#00FFFF",
          purple: "#5D34D0",
        },
      },
      fontFamily: {
        display: ["Russo One", "sans-serif"],
        body: ["Chakra Petch", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern":
          "linear-gradient(135deg, #0F0F23 0%, #1A1A2E 50%, #4C1D95 100%)",
        "card-gradient":
          "linear-gradient(180deg, rgba(124, 58, 237, 0.1) 0%, rgba(15, 15, 35, 0.8) 100%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(124, 58, 237, 0.5)",
        "neon-lg": "0 0 40px rgba(124, 58, 237, 0.6)",
        glow: "0 0 30px rgba(167, 139, 250, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        shake: "shake 0.5s ease-in-out",
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" },
          "100%": { boxShadow: "0 0 40px rgba(124, 58, 237, 0.8)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
