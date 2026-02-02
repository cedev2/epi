/** @type {import('tailwindcss').Config} */
// Force reload
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#1a4f8b',
                    light: '#2a6bb3',
                    dark: '#0d335d',
                },
                accent: {
                    DEFAULT: '#d4af37',
                    light: '#e6c35c',
                },
                text: {
                    main: '#1e293b',
                    muted: '#64748b',
                    light: '#f1f5f9',
                },
            },
        },
    },
    plugins: [],
}
