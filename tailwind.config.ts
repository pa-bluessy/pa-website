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
        pa: {
          bg: "#03050B",
          navy: "#07101F",
          panel: "rgba(10, 18, 35, 0.55)",
          text: "#F3F6FF",
          muted: "#8E9BB2",
          cyan: "#65D9FF",
          violet: "#8B7CFF",
          amber: "#FF9D3C",
          "amber-soft": "#FFB86B",
          border: "rgba(130, 190, 255, 0.18)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Georgia", "serif"],
        display: ["var(--font-sans)", "Georgia", "serif"],
        signature: ["var(--font-signature)", "cursive"],
        mono: ["var(--font-sans)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(101, 217, 255, 0.12)",
        "glow-violet": "0 0 28px rgba(139, 124, 255, 0.14)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(12px, -18px, 0)" },
        },
        "nebula-shift": {
          "0%, 100%": { opacity: "0.45", transform: "scale(1) translate(0, 0)" },
          "50%": { opacity: "0.7", transform: "scale(1.08) translate(-2%, 3%)" },
        },
        "orbit-pulse": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.9" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scene-fade": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "seal-crack": {
          "0%": { transform: "scale(1) rotate(0deg)", filter: "brightness(1)" },
          "35%": { transform: "scale(1.06) rotate(-1.5deg)", filter: "brightness(1.15)" },
          "55%": { transform: "scale(0.97) rotate(1deg)", filter: "brightness(0.92)" },
          "100%": { transform: "scale(1) rotate(0deg)", filter: "brightness(1)", opacity: "1" },
        },
        "seal-stamp": {
          "0%": {
            opacity: "0",
            transform: "translateY(-32px) scale(1.35)",
            filter: "blur(2px)",
          },
          "60%": {
            opacity: "1",
            transform: "translateY(3px) scale(0.96)",
            filter: "blur(0)",
          },
          "78%": {
            transform: "translateY(0) scale(1.03)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
            filter: "blur(0)",
          },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        "nebula-shift": "nebula-shift 22s ease-in-out infinite",
        "orbit-pulse": "orbit-pulse 4s ease-in-out infinite",
        "fade-up": "fade-up 0.8s ease-out both",
        "scene-fade": "scene-fade 2.4s ease-out both",
        "seal-crack": "seal-crack 0.38s ease-out both",
        "seal-stamp":
          "seal-stamp 460ms cubic-bezier(0.2, 0.9, 0.25, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
