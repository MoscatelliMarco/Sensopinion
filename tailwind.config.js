module.exports = {
  content: [
    './src/**/*.svelte', 
    './public/index.html'
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        main: {
          red: "rgb(255,0,0)",
          blue: "rgb(0,0,255)",
          "neutral-light": "#c7c7c7",
          neutral: "#939393",
          "neutral-dark": "#6E6E6E",
          white: "#F2F2F2",
          black: "#0F0F0F",
        }
      }
    ]
  },
  theme: {
    colors: {
      red: "rgb(255,0,0)",
      blue: "rgb(0,0,255)",
      "neutral-light": "#c7c7c7",
      neutral: "#939393",
      "neutral-dark": "#6E6E6E",
      white: "#F2F2F2",
      black: "#0F0F0F",
    }
  }
}