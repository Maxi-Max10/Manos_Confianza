import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          green: "#10B981",
          ink: "#0F172A",
          muted: "#64748B",
          mist: "#F8FAFC",
          warm: "#F59E0B"
        }
      },
      boxShadow: {
        soft: "0 18px 45px -30px rgba(15, 23, 42, 0.30)",
        card: "0 24px 70px -42px rgba(15, 23, 42, 0.42)",
        premium: "0 28px 80px -46px rgba(37, 99, 235, 0.45)",
        glow: "0 18px 50px -28px rgba(16, 185, 129, 0.55)"
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
