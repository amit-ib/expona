/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lexend: ["Lexend", "sans-serif"],
      },
      colors: {
        "expona-red": "#EA1B3D",
        "red-83": "#FF6A83",
        "ib-red": "#AA142D",
        "ib-red-dark": "#7C2235",
        "primary-gray": "#676775",
        "dark-gray": "#2C2C34",
        "darker-gray": "#222222",
        "gray-ec": "#E8EDEC",
        "gray-2f": "#2F2F37",
        "gray-2d": "#292A2D",
        "gray-ae": "#A2A2AE",
        "gray-5c": "#53545C",
        "gray-42": "#373742",
        "gray-37": "#333437",
        "gray-24": "#212224",
        "gray-32": "#2E2F32",
        "gray-4f": "#44444F",
        "gray-99": "#999999",
        "gray-light": "#F8F8F8",
        "border-gray": "rgba(255, 255, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
