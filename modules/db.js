const { Pool } = require('pg');

const pool = createPool();

function createPool() {
  if (process.env.DATABASE_URL != undefined) {
    let ssl = {
      rejectUnauthorized: false,
    };
    return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV == 'production' ? ssl : null,
    });
  }
  return new Pool();
}

module.exports = {
  query: (text, params) => pool.query(text, params),
};
