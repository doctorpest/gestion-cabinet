// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('📦 Connexion à PostgreSQL réussie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion PostgreSQL', err);
  process.exit(-1);
});

module.exports = pool;
