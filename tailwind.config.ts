import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Volombe — minimaliste, luxe naturel
        cream: {
          50:  "#FDFAF7",
          100: "#F8F3ED",
          200: "#F0E8DC",
          300: "#E5D8C8",
          DEFAULT: "#F0E8DC",
        },
        sand: {
          100: "#EDE0CF",
          200: "#D9C9B0",
          300: "#C4AF93",
          400: "#A89278",
          DEFAULT: "#C4AF93",
        },
        stone: {
          warm: "#8A7F74",
          mid:  "#5C534A",
          deep: "#3A3028",
        },
        obsidian: {
          DEFAULT: "#1A1714",
          light:  "#2A2521",
        },
        gold: {
          light:  "#D4B896",
          DEFAULT:"#B8976C",
          deep:   "#8C6D42",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem,8vw,7rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem,5vw,5rem)", { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem,3.5vw,3.5rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(1.5rem,2.5vw,2.5rem)", { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
      },
      spacing: {
        "section": "clamp(5rem,10vh,9rem)",
      },
      animation: {
        "fade-up":    "fadeUp 0.8s ease forwards",
        "fade-in":    "fadeIn 1s ease forwards",
        "line-grow":  "lineGrow 1.2s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        lineGrow: {
          "0%":   { scaleX: "0", transformOrigin: "left" },
          "100%": { scaleX: "1", transformOrigin: "left" },
        },
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "spring":  "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-noise":  "url(\"data:image/svg+xml,...\")",
      },
    },
  },
  plugins: [],
};

export default config;
