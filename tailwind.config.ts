import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./app/landing-preview/**/*.{ts,tsx}",
    "./components/interfrozt/**/*.{ts,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  important: ".interfrozt-preview",
  theme: {
    extend: {
      colors: {
        carbon: "rgb(var(--color-carbon) / <alpha-value>)",
        frost: "rgb(var(--color-frost) / <alpha-value>)",
        quiet: "rgb(var(--color-quiet) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        cryo: "rgb(var(--color-cryo) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      spacing: {
        rail: "150px",
      },
      fontSize: {
        "display-xl": ["7rem", { lineHeight: "0.85", letterSpacing: "0" }],
        "display-lg": ["5rem", { lineHeight: "0.88", letterSpacing: "0" }],
        "display-md": ["3.5rem", { lineHeight: "0.92", letterSpacing: "0" }],
        "display-sm": ["2.5rem", { lineHeight: "0.95", letterSpacing: "0" }],
      },
    },
  },
  plugins: [],
};
export default config;
