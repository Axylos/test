const pgp = require('pg-promise')();

let opts;
if (process.env.DATABASE_URL) {
  opts = {
    connectionString: process.env.DATABASE_URL
  };
} else {
  database: 'publisher_db'
}

const db = pgp(opts);

module.exports = {
  pgp,
  db
};
