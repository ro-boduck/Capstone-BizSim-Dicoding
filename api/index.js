/**
 * BizSim — Vercel Serverless Function Entry Point
 * Wraps Express app initialization with error handling to prevent
 * FUNCTION_INVOCATION_FAILED crashes from silent module-level errors.
 */

let handler;

try {
  const app = require('../lib/app');
  handler = app;
} catch (err) {
  console.error('[API INIT FATAL]', err);
  handler = (_req, res) => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: false,
      message: 'Server initialization failed: ' + (err.message || 'Unknown error'),
    }));
  };
}

module.exports = handler;
