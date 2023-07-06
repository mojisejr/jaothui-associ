import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        w375: "375px",
        w414: "414px",
        w425: "425px",
        w768: "768px",
        w1024: "1024px",
        w1440: "1440px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["lofi", "lemonade"],
  },
} satisfies Config;
