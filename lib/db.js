/**
 * BizSim — Supabase database helpers (server-side, Express)
 * Satisfies: RESTful API with database storage requirement
 */

const { createClient } = require('@supabase/supabase-js');

// ─── Supabase client (service role — full access, server-side only) ───────────
let _supabase = null;

function getSupabase() {
  if (!_supabase) {
    const url  = process.env.SUPABASE_URL;
    const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error('[DB] ⚠ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
      throw new Error('Supabase credentials missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    }

    _supabase = createClient(url, key, {
      auth: { persistSession: false },
    });
    console.log('[DB] ✅ Supabase client initialized');
  }
  return _supabase;
}

// ─── Query helpers ────────────────────────────────────────────────────────────

/**
 * Insert a new simulation record.
 * @param {object} record
 * @returns {object} inserted row
 */
async function insertSimulation(record) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('simulations')
    .insert(record)
    .select()
    .single();

  if (error) throw new Error(`DB insert failed: ${error.message}`);
  return data;
}

/**
 * Get all simulations, newest first, paginated.
 * @param {{ page?: number, limit?: number, userId?: string }} options
 * @returns {{ data: object[], total: number }}
 */
async function getAllSimulations({ page = 1, limit = 50, userId = null } = {}) {
  const supabase = getSupabase();
  const start    = (page - 1) * limit;
  const end      = start + limit - 1;

  let query = supabase
    .from('simulations')
    .select('*', { count: 'exact' });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(start, end);

  if (error) throw new Error(`DB select failed: ${error.message}`);
  return { data: data || [], total: count || 0 };
}

/**
 * Get single simulation by ID.
 * @param {string} id - UUID
 * @param {string} [userId] - User ID
 * @returns {object|null}
 */
async function getSimulationById(id, userId = null) {
  const supabase = getSupabase();
  let query = supabase
    .from('simulations')
    .select('*')
    .eq('id', id);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.single();

  if (error && error.code === 'PGRST116') return null; // Not found
  if (error) throw new Error(`DB select failed: ${error.message}`);
  return data;
}

/**
 * Delete simulation by ID.
 * @param {string} id - UUID
 * @param {string} [userId] - User ID
 * @returns {object|null} deleted row or null if not found
 */
async function deleteSimulation(id, userId = null) {
  const supabase = getSupabase();
  let query = supabase
    .from('simulations')
    .delete()
    .eq('id', id);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.select().single();

  if (error && error.code === 'PGRST116') return null; // Not found
  if (error) throw new Error(`DB delete failed: ${error.message}`);
  return data;
}

module.exports = { 
  insertSimulation, 
  getAllSimulations, 
  getSimulationById, 
  deleteSimulation,
  insertMonthlyLog,
  getMonthlyLogs,
  deleteMonthlyLog
};

/**
 * Insert a new monthly log record.
 * @param {object} record
 * @returns {object} inserted row
 */
async function insertMonthlyLog(record) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('monthly_logs')
    .insert(record)
    .select()
    .single();

  if (error) throw new Error(`DB insert monthly log failed: ${error.message}`);
  return data;
}

/**
 * Get all monthly logs chronologically.
 * @param {string} userId
 * @returns {object[]}
 */
async function getMonthlyLogs(userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('monthly_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`DB select monthly logs failed: ${error.message}`);
  return data || [];
}

/**
 * Delete a monthly log by ID.
 * @param {string} id
 * @param {string} userId
 * @returns {object|null}
 */
async function deleteMonthlyLog(id, userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('monthly_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error && error.code === 'PGRST116') return null; // Not found
  if (error) throw new Error(`DB delete monthly log failed: ${error.message}`);
  return data;
}
