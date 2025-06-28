import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@radix-ui/react-progress"],
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist'
  }
})
