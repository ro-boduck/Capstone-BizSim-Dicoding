import axios from 'axios';

// ─── API base URLs ───────────────────────────────────────────────────────────
const EXPRESS_API = import.meta.env.VITE_EXPRESS_API || 'http://localhost:3001';
const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8000';

// ─── Axios instances ─────────────────────────────────────────────────────────
export const expressApi = axios.create({ baseURL: EXPRESS_API, timeout: 10000 });
export const fastApi    = axios.create({ baseURL: FASTAPI_URL, timeout: 15000 });

// ─── API helpers ──────────────────────────────────────────────────────────────

/**
 * POST /simulations — Save simulation data to Express API
 * Satisfies: FE Axios networking, FE RESTful API, FE data storage
 */
export async function saveSimulation(payload) {
  const res = await expressApi.post('/simulations', payload);
  return res.data;
}

/**
 * GET /simulations — Retrieve all simulations from Express API
 */
export async function getSimulations() {
  const res = await expressApi.get('/simulations');
  return res.data;
}

/**
 * GET /simulations/:id — Get single simulation
 */
export async function getSimulationById(id) {
  const res = await expressApi.get(`/simulations/${id}`);
  return res.data;
}

/**
 * POST /predict — Call FastAPI AI service for prediction
 * Satisfies: AI FastAPI integration, FE Axios networking calls
 */
export async function predict(data) {
  const res = await fastApi.post('/predict', data);
  return res.data;
}

/**
 * GET /health — Check AI service health
 */
export async function checkAIHealth() {
  const res = await fastApi.get('/health');
  return res.data;
}
