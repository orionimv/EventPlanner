// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            // Явно говорим: вход — index.html в корне проекта
            input: resolve(__dirname, 'index.html'),
        },
    },
})
