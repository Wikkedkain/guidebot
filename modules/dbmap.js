const db = require("../modules/db");

// Private functions: https://medium.com/@davidrhyswhite/private-members-in-es6-db1ccd6128a5
const _init = Symbol('init');
const _validateKey = Symbol('validateKey');
const _parseData = Symbol('parseData');
const _stringifyData = Symbol('stringifyData');
const _readyCheck = Symbol('readyCheck');
const _isNil = Symbol('isNil');
const _fetchCheck = Symbol('fetchCheck');
const _fetch = Symbol('fetch');
const _writeToDb = Symbol('writeToDb');

/**
 * A simple Map structure with database persistence.
 * Currently using PostgreSQL explicitly.
 */
class DbMap extends Map {
  /**
   * Creates a new DbMap with name.
   */
  constructor(name) {
    super();
    this.name = name;
    this.autoFetch = true;
    this.dbReady = false;
    this[_init]();
  }
  
  /**
   * INTERNAL: Initializes the DbMap by loading data from the database.
   */
  async [_init]() {
    try {
      const res = await db.query(`SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${this.name}') as exists;`);
      if(res.rows[0].exists) {
        const data = await db.query(`SELECT * FROM ${this.name};`);
        
        data.rows.forEach((row, i) => {
          super.set(row.id, this[_parseData](row.data));
        });
        
        console.log(`Loaded ${data.rows.length} rows from Table: ${this.name}.`);
      } else {
        let sql = `
        CREATE TABLE '${this.name}'
        (
          id varchar(100),
          data text,
          CONSTRAINT ${this.name}_id_unique UNIQUE (id)
        );`;
        await db.query(sql);
      }
      this.dbReady = true;
    }
    catch(err) {
      console.error(err);
    }
  }
  
  /**
   * INTERNAL: Verifies the key is valid.
   */
  [_validateKey](key) {
    if (this[_isNil](key) || !['String', 'Number'].includes(key.constructor.name)) {
      throw new Error('DbMap requires keys to be strings or numbers.');
    }
  }
  
  /**
   * INTERNAL: Parses JSON data.
   */
  [_parseData](data) {
    return JSON.parse(data);
  }
  
  /**
   * INTERNAL: Stringifies data into JSON.
   */
  [_stringifyData](data) {
    return JSON.stringify(data);
  }
  
  /**
   * INTERNAL: Verifies the database is ready.
   */
  [_readyCheck]() {
    if(!this.dbReady) throw new Error('PostgreSQL database is not ready.');
  }
  
  /**
   * INTERNAL: Verifies the value is not null or undefined.
   */
  [_isNil](value) {
    return value == null;
  }
  
  /**
   * INTERNAL: Checks if the specified key is already present
   * or if a fetch is required. Also performs the fetch (if not present).
   */
  async [_fetchCheck](key) {
    this[_validateKey](key);
    if(super.has(key)) return;
    this[_fetch](key);
  }
  
  /**
   * INTERNAL: Fetches the value for the specified key directly from the database.
   */
  async [_fetch](key) {
    const { rows } = await db.query(`SELECT * FROM ${this.name} WHERE id = $1`, [key]);
    if(rows.length == 0) return null;
    
    super.set(rows[0].id, this[_parseData](rows[0].data));
    return this[_parseData](rows[0].data);
  }
  
  /**
   * INTERNAL: Saves the key+value pair to the database.
   */
  async [_writeToDb](key, data) {
    try {
      await db.query(`INSERT INTO ${this.name} (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2`, [key, data]);
    } catch(err) {
      console.error(err);
    }
  }
  
  /**
   * Retrieves a value from DbMap by the specified key.
   */
  get(key) {
    this[_readyCheck]();
    this[_validateKey](key);
    this[_fetchCheck](key); // currently fire and forget (not normally an issue until the bot is sharded)
    
    return super.get(key);
  }
  
  /**
   * Sets a value in DbMap.
   */
  set(key, value) {
    this[_readyCheck]();
    this[_validateKey](key);
    this[_writeToDb](key, this[_stringifyData](value));
    
    return super.set(key, value);
  }
}


module.exports = DbMap;