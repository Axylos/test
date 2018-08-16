const BASE_URL = 'http://localhost:3001';

export function fetchAuthors() {
  return fetch(`${BASE_URL}/authors`)
    .then(resp => resp.json())
    .catch(err => {
      throw Error(err);
    });
}

export function fetchBooks() {
  return fetch(`${BASE_URL}/books`)
    .then(resp => resp.json())
    .catch(err => {
      throw Error(err);
    })
}

export function saveAuthor(author) {
  return 'thing';
}

export function saveBook(book) {
  const opts = {
    method: 'POST',
    body: JSON.stringify(book),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return fetch(`${BASE_URL}/books`, opts)
    .then(resp => resp.json());
}

export function updateBook(book) {
  const opts = {
    method: 'PUT',
    body: JSON.stringify(book),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  return fetch(`${BASE_URL}/books/${book.book_id}`, opts)
    .then(resp => resp.json());
}
