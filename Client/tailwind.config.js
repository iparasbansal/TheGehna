export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // This is the hex code for the image you uploaded
        'brand-maroon': '#633131', 
        'brand-gold': '#d4a34d',
        'brand-dark': '#1a0d0d', // A darker version for shadows/depth
      },
    },
  },
  plugins: [],
}
