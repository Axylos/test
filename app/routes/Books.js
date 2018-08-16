const router = require('express')();
const BooksController = require('../controllers/Books');

router.get('/', 
  BooksController.getAll, 
  (req, res) => res.json({books: res.locals.books})
);

router.post('/',
  BooksController.createBook,
  (req, res) => res.json(res.locals.book)
);

router.put('/:id',
  BooksController.updateBook,
  (req, res) => res.json(res.locals.book))

module.exports = router;
