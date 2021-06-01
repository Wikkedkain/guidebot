const { Pool } = require('pg');

const pool = createPool();

function createPool() {
  if (process.env.DATABASE_URL != undefined) {
    let ssl = process.env.NODE_ENV == 'production' ? '?ssl=require' : '';
    return new Pool({
      connectionString: process.env.DATABASE_URL + ssl,
    });
  }
  return new Pool();
}

module.exports = {
  query: (text, params) => pool.query(text, params),
};
