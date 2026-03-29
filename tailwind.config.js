/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"DM Sans"', '"Helvetica Neue"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
