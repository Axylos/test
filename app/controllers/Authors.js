const AuthorModel = require('../models/Author');

module.exports = {
  getAll(req, res, next) {
    AuthorModel.index()
      .then(authors => {
        res.locals.authors = authors;
        next();
      })
      .catch(next);
  }
}
