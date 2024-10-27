import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // This will include all .js, .jsx, .ts, and .tsx files inside the src folder
    './public/index.html',
    './components/**/*.{js,jsx}',  // Include the public index.html if you're using it
  ],
  theme: {
    extend: {
      animation: {
        "loop-scroll": "loopScroll 70s linear infinite",  // Ensure the animation name matches the keyframes
      },
      keyframes: {
        loopScroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },  // Corrected the typo here
        },
      },
    },
  },
  plugins: [],
};
