import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Allow external connections
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL ? env.VITE_API_URL.replace('/api', '') : 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
