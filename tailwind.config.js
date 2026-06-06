/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                synapse: {
                    yellow: '#F5A800',
                    'yellow-dark': '#C98A00',
                    'yellow-light': '#FFD166',
                    black: '#1A1A1A',
                    'dark-bg': '#222222',
                    gray: '#E8E8E8',
                    'gray-light': '#F7F7F7',
                }
            },
            fontFamily: {
                display: ['OCR A Extended', 'Courier New', 'monospace'],
                body: ['Space Grotesk', 'sans-serif'],
                mono: ['DM Mono', 'monospace'],
            },
        },
    },
    plugins: [],
}