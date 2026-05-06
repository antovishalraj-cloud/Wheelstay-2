/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        dark: {
          900: "#0b0f1a",
          800: "#0f172a",
          700: "#1e293b",
          600: "#334155",
          500: "#475569",
        },
        surface: {
          DEFAULT: "#1e293b",
          raised: "#263349",
          overlay: "rgba(255,255,255,0.05)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)",
        "gradient-dark":  "linear-gradient(180deg, #0b0f1a 0%, #0f172a 100%)",
        "gradient-card":  "linear-gradient(145deg, #1e293b, #263349)",
        "gradient-glow":  "radial-gradient(ellipse at top, #1d4ed820 0%, transparent 70%)",
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(59, 130, 246, 0.15)",
        "glow":    "0 0 30px rgba(59, 130, 246, 0.2)",
        "glow-lg": "0 0 60px rgba(59, 130, 246, 0.25)",
        "card":    "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        float:   { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
    },
  },
  plugins: [],
};
