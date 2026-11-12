import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Те же пути, что Nginx в Docker передаёт сервису backend (см. nginx.conf):
// без /ready, /metrics, /docs и /openapi.json dev-сервер отдавал вместо них index.html.
const backend = 'http://localhost:8000'
const backendPaths = ['/api', '/health', '/ready', '/metrics', '/docs', '/openapi.json']

export default defineConfig({
  plugins: [vue()],
  server: { proxy: Object.fromEntries(backendPaths.map((path) => [path, backend])) },
})
