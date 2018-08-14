const app = require('express')();
const logger = require('morgan');
const bodyParser = require('body-parser');

const bookRouter = require('./routes/Books');

const PORT = 3001;

app.use(logger('dev'))
app.use(bodyParser.urlencoded({extended: false}));

app.use('/books', bookRouter);

app.listen(PORT, () => console.log('listening on port: ', PORT));
