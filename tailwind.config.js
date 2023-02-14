/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    "./index.html",
    "./examples/**/*.{vue,js,ts,jsx,tsx}",
    "./packages/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    accentColor: ({ theme }) => ({
      ...theme("colors"),
      auto: "auto",
    }),
    backgroundColor: ({ theme }) => theme("colors"),
    extend: {},
  },
  safelist: [
    {
      pattern:
        /bg-(slate|gray|zinc|neutral|stone|red|amber|yellow|lime|cyan|purple|fuchsia|pink|rose|emerald|violet|indigo|sky|green|blue|orange)-(50|100|200)/, // You can display all the colors that you need
    },
  ],
  plugins: [],
};
