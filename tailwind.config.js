/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0aad0a',
                    hover: '#088a08',
                },
                secondary: '#212529',
            },
            fontFamily: {
                outfit: ['var(--font-outfit)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
