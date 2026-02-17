const serverless = require('serverless-http');
const app = require('../server'); // Fixed path to go up one level to server.js

module.exports.handler = serverless(app);
