import type { Config } from "tailwindcss";

const config: Config = {
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
        },
        jade: {
          DEFAULT: "#1B7A4A",
          light: "#E0F5EB",
        },
        peacock: {
          DEFAULT: "#0057A8",
          light: "#E0EEFF",
        },
        rose: {
          DEFAULT: "#D63B6A",
          light: "#FDEAF0",
        },
        hornbill: {
          yellow: "#FFD700",
          black: "#1A1A1A",
        },
        cream: {
          DEFAULT: "#FFFBF2",
        },
        surface: {
          light: "#FFFFFF",
        },
        borderLight: "#E8E0D0",
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
