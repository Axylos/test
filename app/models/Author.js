const { db, pgp } = require('../config/conn');

module.exports = {
  create(author) {
    return db.one(`
      INSERT INTO authors
      (first_name, last_name)
      VALUES
      ($/first_name/, $/last_name/)
      RETURNING *
    `, author);
  },

  index() {
    return db.manyOrNone(
      `SELECT *
      FROM authors`
    );
  }

}

