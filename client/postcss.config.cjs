// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
        },
        colors: {
          gray: {
            950: '#0a0c10',
          },
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              color: theme('colors.gray.300'),
              a: {
                color: theme('colors.blue.400'),
                '&:hover': {
                  color: theme('colors.blue.300'),
                },
              },
              h1: {
                color: theme('colors.white'),
              },
              h2: {
                color: theme('colors.white'),
              },
              h3: {
                color: theme('colors.white'),
              },
              h4: {
                color: theme('colors.white'),
              },
              code: {
                color: theme('colors.gray.300'),
                backgroundColor: theme('colors.gray.800'),
                borderRadius: theme('borderRadius.md'),
                padding: `${theme('spacing.1')} ${theme('spacing[1.5]')}`,
              },
              'pre code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
              pre: {
                backgroundColor: theme('colors.gray.800'),
                borderColor: theme('colors.gray.700'),
                borderWidth: '1px',
                borderRadius: theme('borderRadius.lg'),
              },
              blockquote: {
                borderLeftColor: theme('colors.blue.500'),
                backgroundColor: theme('colors.gray.800'),
                opacity: 0.5,
              },
              strong: {
                color: theme('colors.white'),
              },
              hr: {
                borderColor: theme('colors.gray.700'),
              },
              table: {
                borderCollapse: 'collapse',
              },
              th: {
                color: theme('colors.white'),
                backgroundColor: theme('colors.gray.800'),
              },
              td: {
                borderColor: theme('colors.gray.700'),
              },
            },
          },
        }),
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms')({
        strategy: 'class',
      }),
    ],
  };