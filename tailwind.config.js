/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          // Primary colors
          primary: '#3B82F6',
          primaryDark: '#2563EB',
          primaryLight: '#60A5FA',
          
          // Background colors
          background: '#F8FAFC',
          
          // Card colors
          card: '#FFFFFF',
          
          // Text colors
          text: {
            primary: '#1E293B',
            secondary: '#64748B',
          },
          
          // Border colors
          border: '#E2E8F0',
          
          // Status colors
          status: {
            success: '#10B981',
            error: '#F43F5E',
            warning: '#F59E0B',
          },
          
          // Button colors
          button: {
            primary: '#EFF6FF',
            danger: '#FEE2E2',
          },
          
          // Icon colors
          icon: {
            primary: '#64748B',
            accent: '#3B82F6',
          },
          
          // Shadow colors
          shadow: 'rgba(0, 0, 0, 0.05)',
        },
        
        dark: {
          // Primary colors
          primary: '#60A5FA',
          primaryDark: '#3B82F6',
          primaryLight: '#93C5FD',
          
          // Background colors
          background: '#0F172A',
          
          // Card colors
          card: '#1E293B',
          
          // Text colors
          text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
          },
          
          // Border colors
          border: '#334155',
          
          // Status colors
          status: {
            success: '#059669',
            error: '#DC2626',
            warning: '#D97706',
          },
          
          // Button colors
          button: {
            primary: '#1E293B',
            danger: '#7F1D1D',
          },
          
          // Icon colors
          icon: {
            primary: '#94A3B8',
            accent: '#60A5FA',
          },
          
          // Shadow colors
          shadow: 'rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
  plugins: [],
}

