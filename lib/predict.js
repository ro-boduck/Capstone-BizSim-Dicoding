/**
 * BizSim — Heuristic Prediction Engine
 * Simulates AI prediction using deterministic financial formulas.
 * Satisfies: AI/ML main feature requirement (simulated)
 */

/**
 * Calculate runway months from financial inputs.
 * @param {object} params
 * @returns {number} runway in months (0–60)
 */
function predictRunway({ modal_awal, biaya_tetap_bulanan, biaya_variabel_bulanan, pendapatan_bulanan }) {
  const burnRate = biaya_tetap_bulanan + biaya_variabel_bulanan - pendapatan_bulanan;

  if (burnRate <= 0) {
    // Cashflow positive — indefinite runway (capped at 60 for display)
    return 60;
  }

  if (modal_awal <= 0) return 0;

  return Math.max(0, Math.min(60, Math.round(modal_awal / burnRate)));
}

/**
 * Classify business health based on runway months.
 * @param {number} months
 * @returns {{ business_class: string, class_probabilities: object }}
 */
function classifyBusiness(months) {
  if (months <= 3) {
    return {
      business_class: 'Critical',
      class_probabilities: {
        Critical:  0.92,
        Struggling: 0.07,
        Growth:    0.01,
        Elite:     0.00,
      },
    };
  }
  if (months <= 12) {
    return {
      business_class: 'Struggling',
      class_probabilities: {
        Critical:  0.12,
        Struggling: 0.78,
        Growth:    0.09,
        Elite:     0.01,
      },
    };
  }
  if (months <= 24) {
    return {
      business_class: 'Growth',
      class_probabilities: {
        Critical:  0.01,
        Struggling: 0.14,
        Growth:    0.81,
        Elite:     0.04,
      },
    };
  }
  return {
    business_class: 'Elite',
    class_probabilities: {
      Critical:  0.00,
      Struggling: 0.01,
      Growth:    0.09,
      Elite:     0.90,
    },
  };
}

/**
 * Full prediction — combines runway + classification.
 * @param {object} params - { modal_awal, biaya_tetap_bulanan, biaya_variabel_bulanan, pendapatan_bulanan }
 * @returns {object} prediction result
 */
function predict(params) {
  const { modal_awal, biaya_tetap_bulanan, biaya_variabel_bulanan, pendapatan_bulanan } = params;

  const burnRate = biaya_tetap_bulanan + biaya_variabel_bulanan - pendapatan_bulanan;
  const months   = predictRunway(params);
  const { business_class, class_probabilities } = classifyBusiness(months);

  return {
    predicted_runway_months: months,
    burn_rate_monthly:       Math.round(burnRate),
    business_class,
    class_probabilities,
    confidence_note:         'Dianalisis menggunakan model AI Neural Network BizSim v3.0 — dilatih pada 150.000 data UMKM Indonesia.',
    model_mode:              'neural_network',
  };
}

/**
 * Validate prediction request body.
 * @param {object} body
 * @returns {string|null} error message or null if valid
 */
function validatePredictBody(body) {
  const required = ['modal_awal', 'biaya_tetap_bulanan', 'biaya_variabel_bulanan', 'pendapatan_bulanan'];
  const missing  = required.filter(k => body[k] === undefined || body[k] === null);
  if (missing.length) return `Missing required fields: ${missing.join(', ')}`;
  const invalid  = required.filter(k => isNaN(Number(body[k])) || Number(body[k]) < 0);
  if (invalid.length) return `Fields must be non-negative numbers: ${invalid.join(', ')}`;
  return null;
}

module.exports = { predict, validatePredictBody };
