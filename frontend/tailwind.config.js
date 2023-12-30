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
          "neutral-light": "#E7E7E7",
          neutral: "#878787",
          "neutral-dark": "#616161",
          white: "#F6F6F6",
          black: "#0F0F0F",
          "real-white": "#FFFFFF"
        }
      }
    ]
  },
  theme: {
    colors: {
      blue: "rgb(33, 135, 219)",
      purple: "rgb(112, 46, 219)",
      "neutral-light": "#E7E7E7",
      neutral: "#878787",
      "neutral-dark": "#616161",
      white: "#F6F6F6",
      black: "#0F0F0F",
      "real-white": "#FFFFFF"
    },
    extend: {
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
        "13": "3.25rem",
        "18": "4.5rem",
        "88": "22rem",
        "neg-4": "-1rem",
        "neg-8": "-2rem",
        "100": "25rem"
      }
    }
  }
}