import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    root: '.',  // Set the root to current directory
    base: '',   // Set base to empty string
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'https://profitplay9ja.com.ng',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
        },
    },
});