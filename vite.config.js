import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import process from 'process'

export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
  ],
  base: process.env.BASE_PATH || './',
})
