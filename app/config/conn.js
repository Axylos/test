const pgp = require('pg-promise')();

const opts = process.env.DATABASE_URL || {
  database: 'publisher_db'
};
console.log(opts);
console.log(process.env);

const db = pgp(opts);

module.exports = {
  pgp,
  db
};
