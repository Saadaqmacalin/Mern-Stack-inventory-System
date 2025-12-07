/** @type {import('tailwindcss').Config} */
export default {
  // This tells Tailwind which files to scan for classes
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  // This is your safelist configuration
  safelist: [
    {
      pattern:
        /(bg|hover:bg|border|text)-(indigo|amber|red|green)-(100|200|300|400|500|600|700|800|900)/,
      variants: ['hover'], // Optional: Add variants if you need safelisting for them
    },
  ],

  theme: {
    extend: {},
  },
  plugins: [],
};