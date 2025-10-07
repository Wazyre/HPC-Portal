import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import httpProxy from 'http-proxy';

// const proxy = httpProxy.createProxyServer();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         // rewrite: (path) => path.replace(/^\/api/, ''),
//         secure: false,      
//         ws: true,
//         configure: (proxy) => {
//           proxy.on('error', (err) => {
//             console.log('proxy error', err);
//           });
//           proxy.on('proxyReq', (req) => {
//             console.log('Sending Request to the Target:', req.method, req.req.url);
//           });
//           proxy.on('proxyRes', (proxyRes, req) => {
//             console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
//           });
//         },
//       }
//     }
//   },