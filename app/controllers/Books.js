const BookModel = require('../models/Book');

module.exports = {
  getAll(req, res, next) {
    BookModel.index()
      .then(books => {
        res.locals.books = books;
        next();
      })
      .catch(next);
  },

  createBook(req, res, next) {
    const data = {
      title: req.body.title,
      author_id: parseInt(req.body.author_id)
    }

    BookModel.createBook(data)
      .then(book => {
        res.locals.book = book;
        next();
      });
  },

  updateBook(req, res, next) {
    const data = {
      title: req.body.title,
      author_id: parseInt(req.body.author_id),
      book_id: req.body.book_id
    };

    BookModel.updateBook(data)
      .then(book => {
        res.locals.book = book;
        next();
      });
  }
}
