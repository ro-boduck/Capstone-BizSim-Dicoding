/**
 * BizSim — Express Custom Server + Next.js Bootstrap
 *
 * This file starts an Express server that:
 * 1. Delegates /api/* RESTful endpoints to the shared Express app in lib/app.js
 * 2. Delegates all other requests to Next.js for page rendering
 */

require('dotenv').config();

const next = require('next');
const expressApp = require('./lib/app');

// ─── Next.js setup ────────────────────────────────────────────────────────────
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const nextApp = next({ dev, hostname, port });
const nextHandle = nextApp.getRequestHandler();

// ─── Boot ────────────────────────────────────────────────────────────────────
nextApp.prepare().then(() => {
  // We mount the shared Express app
  const server = expressApp;

  // Let Next.js handle all other requests (non-API)
  server.all(/(.*)/, (req, res) => {
    return nextHandle(req, res);
  });

  // Start the custom server
  server.listen(port, hostname, () => {
    console.log(`\n✅ BizSim running on http://localhost:${port}`);
    console.log(`   Express REST API: /api/*`);
    console.log(`   Next.js frontend: all other routes`);
    console.log(`   DB: Supabase Postgres\n`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
