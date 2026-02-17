const serverless = require('serverless-http');
const app = require('../server');

// Forced Update: 2026-02-18-00-15
console.log('--- Netlify Function Initialized ---');

module.exports.handler = serverless(app);
