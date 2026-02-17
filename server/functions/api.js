const serverless = require('serverless-http');
const app = require('../server');

// Initialize database before handling requests to avoid 502 timeouts
const connectDB = require('../config/db');
connectDB();

console.log('--- Netlify API Initialized ---');

module.exports.handler = serverless(app);
