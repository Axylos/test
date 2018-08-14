const router = require('express')();
const BooksController = require('../controllers/Books');

router.get('/', 
  BooksController.getAll, 
  (req, res) => res.json({books: res.locals.books})
);

module.exports = router;
