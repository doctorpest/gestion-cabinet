// // db.js
// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// pool.on('connect', () => {
//   console.log('📦 Connexion à PostgreSQL réussie');
// });

// pool.on('error', (err) => {
//   console.error('❌ Erreur de connexion PostgreSQL', err);
//   process.exit(-1);
// });

// module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  console.log('📦 Connexion à PostgreSQL réussie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion PostgreSQL', err);
  process.exit(-1);
});

module.exports = pool;