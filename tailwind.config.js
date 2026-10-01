/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        cream: "var(--cream)",
        clay: "var(--clay)",
        gold: "var(--gold)",
        jade: "var(--jade)",
        mist: "var(--mist)",
        night: "var(--night)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      transitionTimingFunction: {
        weighted: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        section: "900ms",
        ui: "280ms",
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      fontSize: {
        "fluid-hero": "clamp(3rem, 12vw, 7.5rem)",
        "fluid-display": "clamp(2.25rem, 6vw, 4.5rem)",
        "fluid-h2": "clamp(1.75rem, 4vw, 3rem)",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "sway-slow": "sway 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
    },
  },
  plugins: [],
};
