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
                    50: 'var(--p-50)',
                    100: 'var(--p-100)',
                    200: 'var(--p-200)',
                    300: 'var(--p-300)',
                    400: 'var(--p-400)',
                    500: 'var(--p-500)',
                    600: 'var(--p-600)',
                    700: 'var(--p-700)',
                    800: 'var(--p-800)',
                    900: 'var(--p-900)',
                },
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                accent: {
                    50: '#fdfcf0',
                    500: '#f2f2f2', // Neutral Light
                }
            },
            boxShadow: {
                'card': '0 8px 30px var(--shadow-sm)',
                'card-hover': '0 20px 50px var(--shadow-md)',
                'premium': '0 10px 40px var(--shadow-lg)',
            }
        },
    },
    plugins: [],
}
