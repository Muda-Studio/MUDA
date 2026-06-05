import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
    // Permite importar la carpeta /shared de la raíz del repo (fuera del root del admin)
    fs: { allow: ['..'] },
  },
})
