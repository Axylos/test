const app = require('express')();
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const bookRouter = require('./routes/Books');
const authorRouter = require('./routes/Authors');

const PORT = 3001;

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use('/books', bookRouter);
app.use('/authors', authorRouter);

app.listen(PORT, () => console.log('listening on port: ', PORT));
