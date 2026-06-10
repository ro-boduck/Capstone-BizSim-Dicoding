/**
 * BizSim — Express RESTful API setup
 * This file configures the Express application with all /api/* routes.
 * It is exported so it can be booted either locally (server.js) or as a serverless function on Vercel (api/index.js).
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const { predict, validatePredictBody } = require('./predict');
const { 
  insertSimulation, 
  getAllSimulations, 
  getSimulationById, 
  deleteSimulation,
  insertMonthlyLog,
  getMonthlyLogs,
  deleteMonthlyLog 
} = require('./db');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'] }));
app.use(express.json());

// Vercel rewrite URL reconstruction middleware
// Vercel rewrites /api/:path* → /api, passing the captured path as ?path=...
// This reconstructs the original URL so Express route matching works correctly.
app.use((req, _res, next) => {
  const pathParam = req.query?.path;
  if (pathParam && (req.path === '/' || req.path === '/api' || req.path === '/api/')) {
    // Reconstruct original URL: /api/monthly-logs, /api/simulations/abc, etc.
    req.url = '/api/' + pathParam;
    console.log(`[Vercel Rewrite] Reconstructed URL: ${req.url}`);
  }
  next();
});

// Log middleware
app.use((req, _res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// JWT Authentication Middleware
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasCreds = !!(supabaseUrl && supabaseUrl !== 'undefined' && supabaseServiceKey && supabaseServiceKey !== 'undefined');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (!hasCreds) {
        req.user = { id: 'demo-user-id', email: 'demo@umkm-tracker.id' };
        return next();
      }
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!hasCreds) {
      req.user = { id: 'demo-user-id', email: 'demo@umkm-tracker.id' };
      return next();
    }

    const tempSupabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    
    let user = null;
    let error = null;
    try {
      const authRes = await tempSupabase.auth.getUser(token);
      user = authRes.data?.user;
      error = authRes.error;
    } catch (authErr) {
      console.error('[Auth Middleware getUser Error]', authErr);
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token format or verification failed' });
    }

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]', err);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

// GET /api/health
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'BizSim API',
    db: hasCreds ? 'supabase-postgres' : 'local-storage-demo-mode',
    timestamp: new Date().toISOString(),
  });
});

// POST /api/predict — Simulated AI prediction
app.post(['/api/predict', '/predict'], (req, res) => {
  const error = validatePredictBody(req.body);
  if (error) return res.status(400).json({ success: false, message: error });

  const params = {
    modal_awal: Number(req.body.modal_awal),
    biaya_tetap_bulanan: Number(req.body.biaya_tetap_bulanan),
    biaya_variabel_bulanan: Number(req.body.biaya_variabel_bulanan),
    pendapatan_bulanan: Number(req.body.pendapatan_bulanan),
  };

  const result = predict(params);
  return res.json({ success: true, data: result });
});

// POST /api/simulations — Save simulation
app.post(['/api/simulations', '/simulations'], requireAuth, async (req, res) => {
  try {
    const required = ['modal_awal', 'biaya_tetap_bulanan', 'biaya_variabel_bulanan', 'pendapatan_bulanan'];
    const missing = required.filter(k => req.body[k] === undefined || req.body[k] === null);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }

    const record = {
      user_id: req.user.id,
      modal_awal: Number(req.body.modal_awal),
      biaya_tetap_bulanan: Number(req.body.biaya_tetap_bulanan),
      biaya_variabel_bulanan: Number(req.body.biaya_variabel_bulanan),
      pendapatan_bulanan: Number(req.body.pendapatan_bulanan),
      predicted_months: req.body.predicted_months != null ? Number(req.body.predicted_months) : null,
      business_class: req.body.business_class || null,
      burn_rate: req.body.burn_rate != null ? Number(req.body.burn_rate) : null,
    };

    if (!hasCreds) {
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

// GET /api/simulations — List all
app.get(['/api/simulations', '/simulations'], requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const page = parseInt(req.query.page) || 1;
    
    if (!hasCreds) {
      return res.json({ success: true, data: [], total: 0, page, limit });
    }

    const { data, total } = await getAllSimulations({ page, limit, userId: req.user.id });
    return res.json({ success: true, data, total, page, limit });
  } catch (err) {
    console.error('[GET /api/simulations]', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/simulations/:id — Single
app.get(['/api/simulations/:id', '/simulations/:id'], requireAuth, async (req, res) => {
  try {
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

// DELETE /api/simulations/:id — Delete
app.delete(['/api/simulations/:id', '/simulations/:id'], requireAuth, async (req, res) => {
  try {
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

// GET /api/monthly-logs — Fetch all monthly logs
app.get(['/api/monthly-logs', '/monthly-logs'], requireAuth, async (req, res) => {
  try {
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

// POST /api/monthly-logs — Create new monthly log
app.post(['/api/monthly-logs', '/monthly-logs'], requireAuth, async (req, res) => {
  try {
    const required = ['bulan', 'modal_awal', 'biaya_tetap', 'biaya_variabel', 'pendapatan'];
    const missing = required.filter(k => req.body[k] === undefined || req.body[k] === null);
    if (missing.length) {
      return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(', ')}` });
    }

    const record = {
      user_id: req.user.id,
      bulan: req.body.bulan,
      modal_awal: Number(req.body.modal_awal),
      biaya_tetap: Number(req.body.biaya_tetap),
      biaya_variabel: Number(req.body.biaya_variabel),
      pendapatan: Number(req.body.pendapatan),
    };

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

// DELETE /api/monthly-logs/:id — Delete monthly log
app.delete(['/api/monthly-logs/:id', '/monthly-logs/:id'], requireAuth, async (req, res) => {
  try {
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

// Global error handler — prevents unhandled errors from crashing the serverless function
app.use((err, _req, res, _next) => {
  console.error('[Express Unhandled Error]', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;
