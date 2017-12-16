const { Pool, Client } = require('pg');

class EnmapPostgres {
  
  constructor(options) {
    this.defer = new Promise((resolve) => {
      this.ready = resolve;
    });
    
    this.features = {
      multiProcess: false,
      complexTypes: false,
      keys: 'single'
    }
    
    if (!options.name) throw new Error('Must provide options.name');
    this.name = options.name;
    this.validateName();
  
    this.host = options.host || process.env.PGHOST;
    this.port = options.port || process.env.PGPORT;
    this.user = options.user || process.env.PGUSER;  
    this.password = options.password || process.env.PGPASSWORD;
    this.database = options.database || process.env.USER;
    this.connectionString = options.connectionString || process.env.DATABASE_URL;
  }
  
  async init(enmap) {
    if(!!this.connectionString) {
      this.pool = new Pool({
        connectionString: this.connectionString,
        ssl: true,
      });
    }
    else {
      this.pool = new Pool({
        user: this.user,
        host: this.host,
        database: this.database,
        password: this.password,
        port: this.port,
        ssl: true,
      });
    }
    
    try {
      const res = await this.pool.query(`SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${this.name}');`);
      if(res.rows[0].exists) {
        const data = await this.pool.query(`SELECT * FROM ${this.name};`);
        
        for(let i=0; i<data.rows.length; i++) {
          let iData;
          try {
            iData = JSON.parse(data.rows[i].data);
          } catch(e) {
            iData = data.rows[i].data;
          }
          enmap.set(data.rows[i].id, iData, false);
        }
        console.log(`Loaded ${data.rows.length} rows from PostgreSQL`);
      } else {
        await this.pool.query(`CREATE TABLE ${this.name} (id varchar(100), data text);`);
      }
      this.ready();
    } catch(err) {
      console.log(err.stack);
    }
    
    return this.defer;
  }
  
  /**
   * Internal method used to validate persistent enmap names (valid Windows filenames);
   */
  validateName() {
    this.name = this.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
  
  /**
   * Shuts down the underlying persistent enmap database.
   */
  close() {
    this.pool.end().then(() => console.log('client has disconnected')).catch(console.error);
  }

  /**
   * 
   * @param {*} key Required. The key of the element to add to the EnMap object. 
   * If the EnMap is persistent this value MUST be a string or number.
   * @param {*} val Required. The value of the element to add to the EnMap object. 
   * If the EnMap is persistent this value MUST be stringifiable as JSON.
   */
  set(key, val) {
    if (!key || !['String', 'Number'].includes(key.constructor.name)) {
      throw new Error('PostgreSQL requires keys to be strings or numbers.');
    }
    const data = typeof val === 'object' ? JSON.stringify(val) : val;
    
    (async () => {
      const client = await this.pool.connect();
      
      try {
        await client.query('BEGIN');
        
        const { rows } = await client.query(`with updated as (UPDATE ${this.name} SET data=$2 WHERE id=$1 RETURNING *) INSERT INTO ${this.name}(id, data) SELECT $1,$2 WHERE NOT EXISTS(SELECT * FROM updated);`, [key, data]);
        
        await client.query('COMMIT');
      } catch(e) {
        console.error(e);
        await client.query('ROLLBACK');
      } finally {
        client.release();
      }
    })().catch(console.error);
  }

  /**
   * 
   * @param {*} key Required. The key of the element to add to the EnMap object. 
   * If the EnMap is persistent this value MUST be a string or number.
   * @param {*} val Required. The value of the element to add to the EnMap object. 
   * If the EnMap is persistent this value MUST be stringifiable as JSON.
   */
  async setAsync(key, val) {
    await this.set(key, val);
  }

  /**
   * 
   * @param {*} key Required. The key of the element to delete from the EnMap object. 
   * @param {boolean} bulk Internal property used by the purge method.  
   */
  delete(key) {
    if (!key || !['String', 'Number'].includes(key.constructor.name)) {
      throw new Error('PostgreSQL requires keys to be strings or numbers.');
    }
    console.log(`Deleting ${key} in ${this.name}`);
    (async () => {
      const client = await this.pool.connect();
      
      try {
        await client.query('BEGIN');
        const { rows } = await client.query(`DELETE FROM ${this.name} WHERE id=$1`, [key]);
        
        await client.query('COMMIT');
      } catch(e) {
        await client.query('ROLLBACK');
      } finally {
        client.release();
      }
    })().catch(console.error);
  }

  bulkDelete() {
    console.log(`Deleting all for ${this.name}`);
    (async () => {
      const client = await this.pool.connect();
      
      try {
        await client.query('BEGIN');
        const { rows } = await client.query(`DELETE FROM ${this.name}`);
        
        await client.query('COMMIT');
      } catch(e) {
        await client.query('ROLLBACK');
      } finally {
        client.release();
      }
    })().catch(console.error);
  }

  /**
   * 
   * @param {*} key Required. The key of the element to delete from the EnMap object. 
   * @param {boolean} bulk Internal property used by the purge method.  
   */
  async deleteAsync(key) {
    await this.delete(key);
  }
}

module.exports = EnmapPostgres
