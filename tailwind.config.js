module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}', 'app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: 'var(--blue)',
        black: 'var(--black)',
        skyblue: 'var(--skyblue)',
        block: 'var(--block)',
        'gray-1': 'var(--gray-1)',
        'gray-3': 'var(--gray-3)',
        'gray-4': 'var(--gray-4)',
        'gray-5': 'var(--gray-5)',
        gray: 'var(--gray)',
        white: 'var(--white)',
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },

      boxShadow: {
        'shadow-black': 'var(--shadow-black)',
        'shadow-blue': 'var(--shadow-blue)',
      },
      fontSize: {
        'nav-link': ['1rem', {fontWeight: "700", letterSpacing: '0.025em'}]
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
         sans: ['"Nunito Sans"', ...require('tailwindcss/defaultTheme').fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem"
      }
    },
      screens: {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
  darkMode: ['class'],
};