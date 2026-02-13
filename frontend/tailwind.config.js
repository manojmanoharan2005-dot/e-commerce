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
                    DEFAULT: '#0f172a', // Deep Slate for a premium feel
                    dark: '#020617',
                    light: '#1e293b'
                },
                accent: {
                    DEFAULT: '#10b981', // Emerald for the agriculture theme
                    dark: '#047857',
                    light: '#d1fae5'
                },
                secondary: {
                    DEFAULT: '#6366f1', // Indigo accent
                    dark: '#4338ca',
                    light: '#e0e7ff'
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'none': '0',
                'sm': '0.125rem',
                DEFAULT: '0.25rem',
                'md': '0.375rem',
                'lg': '0.5rem',
                'xl': '0.75rem',
                '2xl': '1rem',
                '3xl': '1.5rem',
                'full': '9999px',
            }
        },
    },
    plugins: [],
}

