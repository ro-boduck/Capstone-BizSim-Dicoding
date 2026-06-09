/**
 * BizSim — Express Custom Server + Next.js Bootstrap
 *
 * This file starts an Express server that:
 * 1. Registers all /api/* RESTful endpoints
 * 2. Delegates all other requests to Next.js for page rendering
 *
 * Satisfies:
 *   - RESTful API built with Express
 *   - RESTful URL conventions (GET/POST/DELETE /api/simulations/:id)
 *   - Data stored in Supabase Postgres
 *   - Module bundler: Next.js (Webpack)
 */

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const next       = require('next');
const { v4: uuidv4 } = require('uuid');

const { predict, validatePredictBody }                                             = require('./lib/predict');
const { 
  insertSimulation, 
  getAllSimulations, 
  getSimulationById, 
  deleteSimulation,
  insertMonthlyLog,
  getMonthlyLogs,
  deleteMonthlyLog 
} = require('./lib/db');

// ─── Next.js setup ────────────────────────────────────────────────────────────
const dev      = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port     = parseInt(process.env.PORT || '3000', 10);

const nextApp    = next({ dev, hostname, port });
const nextHandle = nextApp.getRequestHandler();

// ─── Boot ────────────────────────────────────────────────────────────────────
nextApp.prepare().then(() => {
  const app = express();

  // ─── Middleware ─────────────────────────────────────────────────────────
  app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'] }));
  app.use(express.json());
  app.use((req, _res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
  });

  // ─── JWT Authentication Middleware ──────────────────────────────────────────
  const { createClient } = require('@supabase/supabase-js');
  
  const requireAuth = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const hasCreds = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (!hasCreds) {
          // Fallback to demo mode if no credentials exist
          req.user = { id: 'demo-user-id', email: 'demo@umkm-tracker.id' };
          return next();
        }
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }

      const token = authHeader.split(' ')[1];

      if (!hasCreds) {
        // Fallback to demo mode if no credentials exist but header is present
        req.user = { id: 'demo-user-id', email: 'demo@umkm-tracker.id' };
        return next();
      }

      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      const tempSupabase = createClient(url, key, { auth: { persistSession: false } });
      const { data: { user }, error } = await tempSupabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('[Auth Middleware Error]', err);
      return res.status(500).json({ success: false, message: 'Authentication failed' });
    }
  };

  // ─── GET /api/health ────────────────────────────────────────────────────
  app.get('/api/health', (_req, res) => {
    const hasCreds = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
    res.json({
      success:   true,
      status:    'ok',
      service:   'BizSim API',
      db:        hasCreds ? 'supabase-postgres' : 'local-storage-demo-mode',
      timestamp: new Date().toISOString(),
    });
  });

  // ─── POST /api/predict — Simulated AI prediction ────────────────────────
  app.post('/api/predict', (req, res) => {
    const error = validatePredictBody(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const params = {
      modal_awal:             Number(req.body.modal_awal),
      biaya_tetap_bulanan:    Number(req.body.biaya_tetap_bulanan),
      biaya_variabel_bulanan: Number(req.body.biaya_variabel_bulanan),
      pendapatan_bulanan:     Number(req.body.pendapatan_bulanan),
    };

    const result = predict(params);
    return res.json({ success: true, data: result });
  });

  // ─── POST /api/simulations — Save simulation ────────────────────────────
  app.post('/api/simulations', requireAuth, async (req, res) => {
    try {
      const required = ['modal_awal', 'biaya_tetap_bulanan', 'biaya_variabel_bulanan', 'pendapatan_bulanan'];
      const missing  = required.filter(k => req.body[k] === undefined || req.body[k] === null);
      if (missing.length) {
        return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
      }

      const record = {
        user_id:                req.user.id,
        modal_awal:             Number(req.body.modal_awal),
        biaya_tetap_bulanan:    Number(req.body.biaya_tetap_bulanan),
        biaya_variabel_bulanan: Number(req.body.biaya_variabel_bulanan),
        pendapatan_bulanan:     Number(req.body.pendapatan_bulanan),
        predicted_months:       req.body.predicted_months != null ? Number(req.body.predicted_months) : null,
        business_class:         req.body.business_class   || null,
        burn_rate:              req.body.burn_rate        != null ? Number(req.body.burn_rate) : null,
      };

      const hasCreds = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!hasCreds) {
        // Fallback for Demo Mode: echo the inserted record with a mock ID
        const mockInserted = {
          id: uuidv4(),
          ...record,
          created_at: new Date().toISOString()
        };
        return res.status(201).json({ success: true, data: mockInserted });
      }

      const inserted = await insertSimulation(record);
      return res.status(201).json({ success: true, data: inserted });
    } catch (err) {
      console.error('[POST /api/simulations]', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ─── GET /api/simulations — List all ────────────────────────────────────
  app.get('/api/simulations', requireAuth, async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 50, 100);
      const page  = parseInt(req.query.page)            || 1;
      
      const hasCreds = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!hasCreds) {
        // Demo Mode: simulations are managed on the client, return empty array from server
        return res.json({ success: true, data: [], total: 0, page, limit });
      }

      const { data, total } = await getAllSimulations({ page, limit, userId: req.user.id });
      return res.json({ success: true, data, total, page, limit });
    } catch (err) {
      console.error('[GET /api/simulations]', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ─── GET /api/simulations/:id — Single ──────────────────────────────────
  app.get('/api/simulations/:id', requireAuth, async (req, res) => {
    try {
      const hasCreds = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!hasCreds) {
        return res.status(404).json({ success: false, message: 'Simulation not found in Demo Mode' });
      }

      const record = await getSimulationById(req.params.id, req.user.id);
      if (!record) return res.status(404).json({ success: false, message: 'Simulation not found' });
      return res.json({ success: true, data: record });
    } catch (err) {
      console.error('[GET /api/simulations/:id]', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ─── DELETE /api/simulations/:id — Delete ───────────────────────────────
  app.delete('/api/simulations/:id', requireAuth, async (req, res) => {
    try {
      const hasCreds = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!hasCreds) {
        return res.json({ success: true, data: { id: req.params.id } });
      }

      const deleted = await deleteSimulation(req.params.id, req.user.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Simulation not found' });
      return res.json({ success: true, data: deleted });
    } catch (err) {
      console.error('[DELETE /api/simulations/:id]', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ─── GET /api/monthly-logs — Fetch all monthly logs ─────────────────────────
  app.get('/api/monthly-logs', requireAuth, async (req, res) => {
    try {
      const hasCreds = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!hasCreds) {
        return res.json({ success: true, data: [] });
      }
      const logs = await getMonthlyLogs(req.user.id);
      return res.json({ success: true, data: logs });
    } catch (err) {
      console.error('[GET /api/monthly-logs]', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ─── POST /api/monthly-logs — Create new monthly log ───────────────────────
  app.post('/api/monthly-logs', requireAuth, async (req, res) => {
    try {
      const required = ['bulan', 'modal_awal', 'biaya_tetap', 'biaya_variabel', 'pendapatan'];
      const missing  = required.filter(k => req.body[k] === undefined || req.body[k] === null);
      if (missing.length) {
        return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
      }

      const record = {
        user_id:        req.user.id,
        bulan:          req.body.bulan,
        modal_awal:     Number(req.body.modal_awal),
        biaya_tetap:    Number(req.body.biaya_tetap),
        biaya_variabel: Number(req.body.biaya_variabel),
        pendapatan:     Number(req.body.pendapatan),
      };

      const hasCreds = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!hasCreds) {
        const mockInserted = {
          id: uuidv4(),
          created_at: new Date().toISOString(),
          ...record
        };
        return res.status(201).json({ success: true, data: mockInserted });
      }

      const inserted = await insertMonthlyLog(record);
      return res.status(201).json({ success: true, data: inserted });
    } catch (err) {
      console.error('[POST /api/monthly-logs]', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ─── DELETE /api/monthly-logs/:id — Delete monthly log ─────────────────────
  app.delete('/api/monthly-logs/:id', requireAuth, async (req, res) => {
    try {
      const hasCreds = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!hasCreds) {
        return res.json({ success: true, data: { id: req.params.id } });
      }
      const deleted = await deleteMonthlyLog(req.params.id, req.user.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Monthly log not found' });
      return res.json({ success: true, data: deleted });
    } catch (err) {
      console.error('[DELETE /api/monthly-logs/:id]', err.message);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  // ─── 404 for unrecognised /api/* routes ─────────────────────────────────────
  app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'API route not found' });
  });

  // ─── All other requests → Next.js ───────────────────────────────────────────
  app.all(/(.*)/, (req, res) => {
    return nextHandle(req, res);
  });

  // ─── Start server ────────────────────────────────────────────────────────
  app.listen(port, hostname, () => {
    console.log(`\n✅ BizSim running on http://localhost:${port}`);
    console.log(`   Express REST API: /api/*`);
    console.log(`   Next.js frontend: all other routes`);
    console.log(`   DB: Supabase Postgres\n`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
