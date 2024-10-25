import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'https://profitplay9ja.com.ng', // The base URL of your API
                changeOrigin: true,                     // Changes the origin of the host header to the target URL
                secure: true,                           // Use this if you're using HTTPS
                rewrite: (path) => path.replace(/^\/api/, '/api'), // Keep /api in the rewritten path
            },
        },
    },
});
