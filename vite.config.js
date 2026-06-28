import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default {
  base: '/Political-Test/'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})
