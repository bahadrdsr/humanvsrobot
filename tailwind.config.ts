import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skyplay: {
          cream: "#fff8e7",
          coral: "#ff7f50",
          teal: "#1f9d8b",
          navy: "#16324f",
          lemon: "#ffd166"
        }
      },
      fontFamily: {
        display: ["Trebuchet MS", "Verdana", "sans-serif"],
        body: ["Tahoma", "Geneva", "sans-serif"]
      },
      boxShadow: {
        bubble: "0 18px 40px rgba(22, 50, 79, 0.18)"
      }
    }
  },
  plugins: []
} satisfies Config;