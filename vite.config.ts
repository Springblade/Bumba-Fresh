import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< Updated upstream
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
=======
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
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
>>>>>>> Stashed changes
})
