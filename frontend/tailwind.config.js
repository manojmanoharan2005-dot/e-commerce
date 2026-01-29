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
                    DEFAULT: '#2874f0',
                    dark: '#1e5bc6',
                    light: '#5a8dee'
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
