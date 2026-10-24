const shared = require('../lib/config');

module.exports = {
  ...shared,
  dbUri: process.env.DB_URI || 'mongodb://127.0.0.1:27017/portfolio',
  port: Number(process.env.PORT) || 3000,
};
