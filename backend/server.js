/**
 * BizSim Express.js RESTful API
 * Satisfies: FE RESTful API (Express.js), FE RESTful URL conventions,
 *            FE data storage (JSON file-based persistence)
 *
 * Endpoints:
 *   POST   /simulations       — Save a new simulation record
 *   GET    /simulations       — List all simulation records
 *   GET    /simulations/:id   — Get single simulation by ID
 *   DELETE /simulations/:id   — Delete a simulation
 *   GET    /health            — API health check
 */

const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs   = require('fs');
const path = require('path');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'] }));
app.use(bodyParser.json());
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Simple file-based data storage ──────────────────────────────────────────
// Using JSON file as lightweight DB. Satisfies: FE data storage requirement.
const DB_PATH = path.join(__dirname, 'data', 'simulations.json');

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function writeDB(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Request validator ────────────────────────────────────────────────────────
function validateSimulationBody(body) {
  const required = ['modal_awal', 'biaya_tetap_bulanan', 'biaya_variabel_bulanan', 'pendapatan_bulanan'];
  const missing  = required.filter(k => body[k] === undefined || body[k] === null);
  if (missing.length) return `Missing required fields: ${missing.join(', ')}`;
  const invalid = required.filter(k => isNaN(Number(body[k])) || Number(body[k]) < 0);
  if (invalid.length) return `Fields must be non-negative numbers: ${invalid.join(', ')}`;
  return null;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'BizSim Express API', timestamp: new Date().toISOString() });
});

// POST /simulations — Create simulation record
app.post('/simulations', (req, res) => {
  const error = validateSimulationBody(req.body);
  if (error) return res.status(400).json({ success: false, message: error });

  const record = {
    id:                     uuidv4(),
    modal_awal:             Number(req.body.modal_awal),
    biaya_tetap_bulanan:    Number(req.body.biaya_tetap_bulanan),
    biaya_variabel_bulanan: Number(req.body.biaya_variabel_bulanan),
    pendapatan_bulanan:     Number(req.body.pendapatan_bulanan),
    predicted_months:       req.body.predicted_months !== undefined ? Number(req.body.predicted_months) : null,
    created_at:             new Date().toISOString(),
  };

  const db = readDB();
  db.unshift(record); // newest first
  writeDB(db);

  return res.status(201).json({ success: true, data: record });
});

// GET /simulations — List all simulations (newest first)
app.get('/simulations', (req, res) => {
  const db    = readDB();
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const page  = parseInt(req.query.page) || 1;
  const start = (page - 1) * limit;
  const slice = db.slice(start, start + limit);

  return res.json({
    success: true,
    data:    slice,
    total:   db.length,
    page,
    limit,
  });
});

// GET /simulations/:id — Single simulation
app.get('/simulations/:id', (req, res) => {
  const db     = readDB();
  const record = db.find(r => r.id === req.params.id);
  if (!record) return res.status(404).json({ success: false, message: 'Simulation not found' });
  return res.json({ success: true, data: record });
});

// DELETE /simulations/:id — Delete simulation
app.delete('/simulations/:id', (req, res) => {
  const db    = readDB();
  const index = db.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Simulation not found' });
  const [deleted] = db.splice(index, 1);
  writeDB(db);
  return res.json({ success: true, data: deleted });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ BizSim Express API running on http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   POST   /simulations`);
  console.log(`   GET    /simulations`);
  console.log(`   GET    /simulations/:id`);
  console.log(`   DELETE /simulations/:id\n`);
});

module.exports = app;
