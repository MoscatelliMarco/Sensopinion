const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.svelte', 
    './src/**/*.html'
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        main: {
          blue: "rgb(33, 135, 219)",
          purple: "rgb(112, 46, 219)",
          "grey-1": "#616161",
          "grey-2": "#969696",
          "grey-3": "#CACACA",
          "grey-4": "#F1F1F1",
          "neutral-light": "#E2E2E2",
          neutral: "#878787",
          "neutral-dark": "#616161",
          white: "#FEFEFE",
          black: "#0F0F0F",
          "real-white": "#FFFFFF"
        }
      }
    ]
  },
  theme: {
    extend: {
      colors: {
        blue: "rgb(33, 135, 219)",
        purple: "rgb(112, 46, 219)",
        "grey-1": "#616161",
        "grey-2": "#969696",
        "grey-3": "#CACACA",
        "grey-4": "#F1F1F1",
        "neutral-light": "#E2E2E2",
        neutral: "#878787",
        "neutral-dark": "#616161",
        white: "#FEFEFE",
        black: "#0F0F0F",
        "real-white": "#FFFFFF"
      },
      fontSize: {
        "xxs":  ["0.625rem", "0.75rem"]
      },
      borderWidth: {
        "3": "3px"
      },
      fontFamily: {
        "main": ["Roboto", ...defaultTheme.fontFamily.sans]
      },
      spacing: {
        "neg-2": "-0.25rem",
        "neg-4": "-1rem",
        "neg-8": "-2rem",
        "0.25": "0.0625rem",
        "4.5": "1.125rem",
        "6.5": "1.625rem",
        "13": "3.25rem",
        "18": "4.5rem",
        "38": "9.5rem",
        "88": "22rem",
        "100": "25rem",
        "104": "26rem",
        "124": "31rem",
        "144": "36rem"
      },
      borderRadius: {
        // "4xl": "2.25rem",
        // "5xl": "3rem",
        "6xl": "4rem"
      }
    }
  },
  safelist: [
    "bg-error",
    "border-error"
  ],
}