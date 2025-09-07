import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), tailwindcss(), svgr({ svgrOptions: { icon: true } })],
  server: {
    host: true, 
    port: 5173,
    allowedHosts: ['sazrisi.ge', 'localhost', '127.0.0.1'], 
  },
})
