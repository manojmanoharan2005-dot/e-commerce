/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2e7d32',
                    dark: '#1b5e20',
                    light: '#a5d6a7'
                },
                secondary: {
                    DEFAULT: '#fb641b',
                    dark: '#e65100',
                    light: '#ff9f00'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
