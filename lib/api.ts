import axios from 'axios';

// ─── Axios instance ───────────────────────────────────────────────────────────
// All requests go to /api/* on the same origin (Express handles them)
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Dynamic JWT Injection Interceptor
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabaseClient');
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      } else {
        const mockUser = localStorage.getItem('bizsim_demo_user');
        if (mockUser) {
          config.headers.Authorization = `Bearer mock-demo-jwt-token`;
        }
      }
    } catch (e) {
      console.warn('Axios auth interceptor: Failed to retrieve token', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SimulationInput {
  modal_awal:             number;
  biaya_tetap_bulanan:    number;
  biaya_variabel_bulanan: number;
  pendapatan_bulanan:     number;
}

export interface PredictResult {
  predicted_runway_months: number;
  burn_rate_monthly:       number;
  business_class:          'Critical' | 'Struggling' | 'Growth' | 'Elite';
  class_probabilities:     { Critical: number; Struggling: number; Growth: number; Elite: number };
  confidence_note:         string;
  model_mode:              string;
}

export interface Simulation {
  id:                    string;
  modal_awal:            number;
  biaya_tetap_bulanan:   number;
  biaya_variabel_bulanan:number;
  pendapatan_bulanan:    number;
  predicted_months:      number | null;
  business_class:        string | null;
  burn_rate:             number | null;
  created_at:            string;
}

export interface SimulationSavePayload extends SimulationInput {
  predicted_months?: number;
  business_class?:   string;
  burn_rate?:        number;
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * POST /api/predict — Simulated AI prediction
 */
export async function predict(data: SimulationInput): Promise<PredictResult> {
  const res = await api.post<{ success: boolean; data: PredictResult }>('/predict', data);
  return res.data.data;
}

/**
 * POST /api/simulations — Save simulation to Supabase
 */
export async function saveSimulation(payload: SimulationSavePayload): Promise<Simulation> {
  const res = await api.post<{ success: boolean; data: Simulation }>('/simulations', payload);
  return res.data.data;
}

/**
 * GET /api/simulations — List all simulations
 */
export async function getSimulations(): Promise<{ data: Simulation[]; total: number }> {
  const res = await api.get<{ success: boolean; data: Simulation[]; total: number }>('/simulations');
  return { data: res.data.data, total: res.data.total };
}

/**
 * GET /api/simulations/:id — Single simulation
 */
export async function getSimulationById(id: string): Promise<Simulation> {
  const res = await api.get<{ success: boolean; data: Simulation }>(`/simulations/${id}`);
  return res.data.data;
}

/**
 * DELETE /api/simulations/:id — Delete simulation
 */
export async function deleteSimulation(id: string): Promise<Simulation> {
  const res = await api.delete<{ success: boolean; data: Simulation }>(`/simulations/${id}`);
  return res.data.data;
}

/**
 * GET /api/health — Health check
 */
export async function checkHealth(): Promise<{ status: string; db: string }> {
  const res = await api.get<{ success: boolean; status: string; db: string }>('/health');
  return res.data;
}

// ─── Monthly Logs API Helpers ──────────────────────────────────────────────────

export interface MonthlyLog {
  id: string;
  user_id: string;
  bulan: string;
  modal_awal: number;
  biaya_tetap: number;
  biaya_variabel: number;
  pendapatan: number;
  created_at: string;
}

export interface MonthlyLogInput {
  bulan: string;
  modal_awal: number;
  biaya_tetap: number;
  biaya_variabel: number;
  pendapatan: number;
}

/**
 * GET /api/monthly-logs — List all monthly entries
 */
export async function getMonthlyLogs(): Promise<MonthlyLog[]> {
  const res = await api.get<{ success: boolean; data: MonthlyLog[] }>('/monthly-logs');
  return res.data.data;
}

/**
 * POST /api/monthly-logs — Save a monthly entry
 */
export async function saveMonthlyLog(data: MonthlyLogInput): Promise<MonthlyLog> {
  const res = await api.post<{ success: boolean; data: MonthlyLog }>('/monthly-logs', data);
  return res.data.data;
}

/**
 * DELETE /api/monthly-logs/:id — Delete a monthly entry
 */
export async function deleteMonthlyLog(id: string): Promise<MonthlyLog> {
  const res = await api.delete<{ success: boolean; data: MonthlyLog }>(`/monthly-logs/${id}`);
  return res.data.data;
}
