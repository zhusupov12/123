const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'aset',
    host: 'localhost',
    database: 'api',
    password: 'Aset',
    port: 5432,
})

module.exports = pool;