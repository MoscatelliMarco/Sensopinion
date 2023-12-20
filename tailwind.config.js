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
          "primary": "rgb(255,0,0)",
          "secondary": "rgb(0,0,255)",
          neutral: "#D1D1D1"
        }
      }
    ]
  }
}