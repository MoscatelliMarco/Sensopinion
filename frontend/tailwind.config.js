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
          "neutral-light": "#E0E0E0",
          neutral: "#878787",
          "neutral-dark": "#616161",
          white: "#F2F2F2",
          black: "#0F0F0F"
        }
      }
    ]
  },
  theme: {
    extend: {
      fontFamily: {
        "main": ["Roboto", ...defaultTheme.fontFamily.sans]
      },
      colors: {
        blue: "rgb(33, 135, 219)",
        purple: "rgb(112, 46, 219)",
        "neutral-light": "#E0E0E0",
        neutral: "#878787",
        "neutral-dark": "#616161",
        white: "#F2F2F2",
        black: "#0F0F0F",
      },
      spacing: {
        '18': '4.5rem',
        '112': '27rem',
        '124': '30rem',
      }
    }
  }
}