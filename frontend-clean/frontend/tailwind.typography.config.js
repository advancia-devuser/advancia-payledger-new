// Tailwind Typography Configuration - Advancia Pay
// Platform: Major Second (1.125) - Professional, data-dense interfaces
// Marketing: Major Third (1.250) - Strong visual hierarchy

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Platform Typography (Major Second - 1.125)
      fontSize: {
        // Platform sizes
        xs: ["0.79rem", { lineHeight: "1.5" }],
        sm: ["0.89rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.266rem", { lineHeight: "1.4" }],
        "2xl": ["1.424rem", { lineHeight: "1.3" }],
        "3xl": ["1.602rem", { lineHeight: "1.2" }],
        "4xl": ["1.802rem", { lineHeight: "1.2" }],
        "5xl": ["2.027rem", { lineHeight: "1.2" }],

        // Marketing sizes (Major Third - 1.250)
        "marketing-xs": ["0.64rem", { lineHeight: "1.5" }],
        "marketing-sm": ["0.8rem", { lineHeight: "1.5" }],
        "marketing-base": ["1rem", { lineHeight: "1.75" }],
        "marketing-lg": ["1.25rem", { lineHeight: "1.75" }],
        "marketing-xl": ["1.563rem", { lineHeight: "1.5" }],
        "marketing-2xl": ["1.953rem", { lineHeight: "1.4" }],
        "marketing-3xl": ["2.441rem", { lineHeight: "1.3" }],
        "marketing-4xl": ["3.052rem", { lineHeight: "1.2" }],
        "marketing-5xl": ["3.815rem", { lineHeight: "1.2" }],
      },

      // Font Families
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"Roboto"',
          "sans-serif",
        ],
        mono: ['"Courier New"', "monospace"],
        display: ['"Inter"', "system-ui", "sans-serif"],
      },

      // Font Weights
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },

      // Line Heights
      lineHeight: {
        tight: "1.2",
        normal: "1.5",
        relaxed: "1.75",
      },

      // Custom spacing for typography rhythm
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },

      // Max width for readable content
      maxWidth: {
        readable: "65ch",
        narrow: "45ch",
        wide: "90ch",
      },
    },
  },
  plugins: [
    // Custom typography utilities
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".text-readable": {
          maxWidth: theme("maxWidth.readable"),
          lineHeight: theme("lineHeight.relaxed"),
        },
        ".text-narrow": {
          maxWidth: theme("maxWidth.narrow"),
          lineHeight: theme("lineHeight.relaxed"),
        },
        ".text-wide": {
          maxWidth: theme("maxWidth.wide"),
          lineHeight: theme("lineHeight.normal"),
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
