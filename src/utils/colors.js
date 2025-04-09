// src/utils/colors.js
const colors = {
  // Primary color
  primary: "#9d3353",
  primaryLight: "#b53b62",
  primaryDark: "#852c45",
  
  secondary: "#3f8ca8",
  secondaryLight: "#4a9bbe",
  secondaryDark: "#367a90",
  
  // Accent colors for multi-series data
  accent1: "#f2746b", // Coral
  accent2: "#5e60ce", // Indigo
  accent3: "#64a87a", // Sage
  
  neutral: {
    900: "#121826", // Near black, for primary text
    700: "#384255", // Dark slate, for secondary text
    500: "#606b85", // Medium slate, for tertiary text
    300: "#a4adc1", // Light slate, for disabled text
    200: "#d0d6e6", // Very light slate, for borders
    100: "#f0f2f9", // Near white, for backgrounds
  },
  
  // Functional colors
  success: "#4cb782",
  warning: "#f8b44c",
  error: "#e65a5a",
  info: "#5692e8",
  
  // Status colors
  status: {
    waiting: "#fff8e1",
    pickedUp: "#e8f5e9",
    expired: "#ffebee",
    expiringSoon: "#fff3e0"
  }
};

export default colors;