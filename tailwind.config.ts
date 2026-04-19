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
        green: {
          DEFAULT: "#00ff41",
          light: "#7fff00",
          dark: "#00cc33",
        },
        cyan: {
          DEFAULT: "#00bfff",
          light: "#00ffff",
          dark: "#0099cc",
        },
        pink: {
          DEFAULT: "#ff00ff",
          light: "#ff66ff",
          dark: "#cc00cc",
        },
        yellow: {
          DEFAULT: "#ffcc00",
          light: "#ffff00",
          dark: "#cc9900",
        },
        red: {
          DEFAULT: "#ff006e",
          light: "#ff3385",
          dark: "#cc0055",
        },
        black: {
          DEFAULT: "#0a0a0f",
          light: "#1a1a2e",
          lighter: "#2a2a4e",
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        cyber: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
