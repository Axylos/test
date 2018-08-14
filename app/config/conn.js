const pgp = require('pg-promise')();

const opts = {
  database: 'publisher_db'
};

const db = pgp(opts);

module.exports = {
  pgp,
  db
};
