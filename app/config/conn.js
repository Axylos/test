const pgp = require('pg-promise')();

const opts = process.env.DATABASE_URL || {
  database: 'publisher_db'
};
console.log(opts);
console.log(process.env);
console.log(process.env.DATABASE_URL);

const db = pgp(opts);

module.exports = {
  pgp,
  db
};
