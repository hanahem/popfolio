module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bg: "#f9f8ff",
        brand: {
          100: "#ffd0ea",
          200: "#f9b5da",
          300: "#f299c9",
          400: "#eb7cb8",
          500: "#e35da6",
          600: "#d9519b",
          700: "#e35da6",
          800: "#c53985",
          900: "#bb2b7a"
        },
        dBrand: "#140e63",
        dark: "#17181C",
        lDark: "#434343",
        mGray: "#979797",
        sideGray: "#2C2D31",
        sideIcon: "#62686e",
        danger: "#C84B4B",
        lSuccess: "#90E586",
        success: "#0CAB2C",
        disabled: "#E6E6E6",
        background: "#fff",
        //darkmode colors
        darkbg: "#211d45",
        darkfg: "#171531",
        darkgray: "#4b4779"
      },
      borderRadius: {
        DEFAULT: ".5rem",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled", "hover"],
      borderWidth: ["hover"],
    },
  },
  plugins: [],
};
