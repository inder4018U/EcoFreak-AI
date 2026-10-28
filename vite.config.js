import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'dev-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url || !req.url.startsWith('/api/')) return next();

            let body = {};
            if (req.method === 'POST') {
              const buffers = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const raw = Buffer.concat(buffers).toString();
              if (raw) {
                try {
                  body = JSON.parse(raw);
                } catch {
                  // ignore non-json body
                }
              }
            }

            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            const mockReq = {
              method: req.method,
              url: req.url,
              headers: req.headers,
              body
            };

            try {
              if (req.url.startsWith('/api/carbon-estimate')) {
                const { default: handler } = await import('./api/carbon-estimate.js');
                return await handler(mockReq, res);
              }

              if (req.url.startsWith('/api/classify')) {
                const { default: handler } = await import('./api/classify.js');
                return await handler(mockReq, res);
              }
            } catch (err) {
              console.error('Dev API error:', err);
              return res.status(500).json({ error: err.message });
            }

            next();
          });
        }
      }
    ],
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-tfjs': ['@tensorflow/tfjs', '@teachablemachine/image'],
            'vendor-react': ['react', 'react-dom']
          }
        }
      }
    },
    server: {
      host: true,
      port: 5173
    }
  };
});
