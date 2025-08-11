/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ECB3BE",
        "primary-50": "#FDF5F7",
        "primary-100": "#FBEBEF",
        "primary-200": "#F6D7DF",
        "primary-300": "#F1C3CF",
        "primary-400": "#ECB3BE", // 기본 색상
        "primary-500": "#E69EAE",
        "primary-600": "#D9899D",
        "primary-700": "#C6748D",
        "primary-800": "#B3607D",
        "primary-900": "#9F4C6D",
        "primary-950": "#7A3551",
      },
    },
  },
  plugins: [],
};
