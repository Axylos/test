const { db, pgp } = require('../config/conn');

module.exports = {
  create(book) {
    return db.one(`
    INSERT INTO books
    (title, author_id)
    VALUES ($/title/, $/author_id/)
    RETURNING *
    `, book);
  },

  index() {
    return db.manyOrNone(`
    SELECT * FROM books
    `);
  },
}
