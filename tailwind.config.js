/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        basic: "#e7e7e7",
        secondary: "#141414",
        primary: "#F3748F", // 기본 색상
        "primary-50": "#FEF2F4",
        "primary-100": "#FDE6EA",
        "primary-200": "#FBCDD5",
        "primary-300": "#F8A5B4",
        "primary-400": "#F3748F",
        "primary-500": "#F3748F",
        "primary-600": "#E85A7A",
        "primary-700": "#D94365",
        "primary-800": "#B8365A",
        "primary-900": "#9D2E4F",
        "primary-950": "#561729",
      },
      fontFamily: {
        presentation: ['"Presentation"', '"Noto Sans KR"', 'sans-serif'],
      },
      
    },
  },
  plugins: [],
};
