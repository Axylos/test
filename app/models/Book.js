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

  createBook(book) {
    return db.one(`
    INSERT INTO books
    (title, author_id)
    VALUES
    ($/title/, $/author_id/)
    RETURNING *
    `, book);
  },

  updateBook(book) {
    return db.one(`
    UPDATE books
    SET 
    title=$/title/,
    author_id=$/author_id/
    WHERE book_id = $/book_id/
    RETURNING *
    `, book);
  }
}
