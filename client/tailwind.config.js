/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    light: '#1B3A7A',
                    DEFAULT: '#0F2044',
                    dark: '#081226',
                },
                gold: {
                    light: '#DCC37E',
                    DEFAULT: '#C9A84C',
                    dark: '#9F853B',
                },
                soft: {
                    gray: '#F8FAFC',
                    warm: '#FDFCFB',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
