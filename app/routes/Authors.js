const router = require('express')();

const AuthorsController = require('../controllers/Authors');

router.get('/',
  AuthorsController.getAll,
  (req, res) => res.json({authors: res.locals.authors})
);

module.exports = router;
