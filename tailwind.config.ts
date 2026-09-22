import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: "#FF6B00",
          light: "#FFF0E0",
          mid: "#FFB347",
          darkLight: "#351a08",
        },
        jade: {
          DEFAULT: "#1B7A4A",
          light: "#E0F5EB",
          dark: "#135a38",
          darkLight: "#0f2c1e",
        },
        peacock: {
          DEFAULT: "#0057A8",
          light: "#E0EEFF",
          darkLight: "#0a223e",
        },
        rose: {
          DEFAULT: "#D63B6A",
          light: "#FDEAF0",
          darkLight: "#350e1b",
        },
        hornbill: {
          yellow: "#FFD700",
          black: "#1A1A1A",
        },
        cream: {
          DEFAULT: "#FFFBF2",
          dark: "#0d1310",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#16201b",
          darker: "#101814",
        },
        borderLight: "#E8E0D0",
        borderDark: "#273830",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        club: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
