/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f0f",
        bone: "#f3f2ee",
        acid: "#b9f227",
        ember: "#ff5f4a",
        sea: "#1ee3cf",
        steel: "#141a1b"
      },
      boxShadow: {
        glow: "0 0 30px rgba(185, 242, 39, 0.35)",
        ember: "0 0 30px rgba(255, 95, 74, 0.4)"
      }
    }
  },
  plugins: []
};
