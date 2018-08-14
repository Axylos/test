const AuthorModel = require('../models/Author');
const BookModel = require('../models/Book');

const data = [
  {
    first_name: 'Evelyn',
    last_name: 'Waugh',
  },
  {
    first_name: 'Edmund',
    last_name: 'Husserl',
  },
  {
    first_name: 'Immanuel',
    last_name: 'Kant'
  },
  {
    first_name: 'Stephen',
    last_name: 'King',
  },
  {
    first_name: 'George',
    last_name: 'Martin',
  },
  {
    first_name: 'Stan',
    last_name: 'Lee',
  },
];

function createBooks(authors) {
  const kant = authors.find(author => author.last_name === 'Kant')
  const lee = authors.find(author => author.last_name === 'Lee');
  const martin = authors.find(author => author.last_name === 'Martin');
  const husserl = authors.find(author => author.last_name === 'Husserl');

  const books = [
    {
      title: 'Critique of Pure Reason',
      author_id: kant.author_id
    },
    {
      title: 'Batman',
      author_id: lee.author_id
    },
    {
      title: 'Override',
      author_id: martin.author_id,
    },
    {
      title: 'Formal and Transcendental Logic',
      author_id: husserl.author_id,
    },
  ];

  const txs = books.map(book => BookModel.create(book));
  return Promise.all(txs);
}
const txs = data.map(author => AuthorModel.create(author))
Promise.all(txs)
  .then(createBooks)
  .then(data => console.log('all done! ', data))
  .catch(err => console.log(`oopsie: ${err}`))
