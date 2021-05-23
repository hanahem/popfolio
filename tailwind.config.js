module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        bg: "#f9f8ff",
        brand: "#211d45",
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
