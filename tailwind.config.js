/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'], // Update paths based on your project structure
  theme: {
    extend: {
      colors: {
        primary: '#0053FF',       // Default primary color
        accent: '#FFC107',    // Amber accent color
        background: '#F4F5F7',   // Light Gray background
        surface: '#FFFFFF',      // White for cards or elevated sections
        success: '#28A745',      // Green for success
        error: '#DC3545',        // Red for error
        text: '#1A1A1A',         // Dark Gray for main text
        neutral: '#6C757D',      // Muted Gray for secondary text
      },
    },
  },
  plugins: [],
};
