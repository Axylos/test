const BookModel = require('../models/Book');

module.exports = {
  getAll(req, res, next) {
    BookModel.index()
      .then(books => {
        res.locals.books = books;
        next();
      })
      .catch(next);
  }
}
