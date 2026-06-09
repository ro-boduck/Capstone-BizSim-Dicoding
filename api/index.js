const app = require('../lib/app');

// Vercel serverless functions handle requests directly from the exported Express app instance.
module.exports = app;
