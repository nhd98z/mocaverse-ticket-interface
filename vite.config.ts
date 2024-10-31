import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react-swc'
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [nodePolyfills(), react()],
  server: {
    open: true,
    port: 9574,
  },
  build: {
    minify: true,
    sourcemap: true,
  },
})
