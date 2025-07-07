module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}', 'app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    screens: {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px"
    },
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
        grey: 'var(--grey)',
        'grey-1': 'var(--grey-1)',
        white: 'var(--white)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'var(--blue)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
      },
      boxShadow: {
        'shadow-black': 'var(--shadow-black)',
        'shadow-blue': 'var(--shadow-blue)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
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
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
  },
  plugins: [],
  darkMode: ['class'],
};