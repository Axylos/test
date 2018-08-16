import React from 'react';

function getAuthorName(authors, author_id) {
  const author = authors.find(author => author.author_id === author_id);
  return `${author.first_name} ${author.last_name}`;
}

function BookIndex(props) {
  const { books, authors } = props;

  return (
    <div>
      <h2>Book Index</h2>
      {books.map(book => (
        <div key={book.book_id}>
          <p>Title: {book.title}</p>
          <p>Author: {getAuthorName(authors, book.author_id)}</p>
          <button 
            onClick={(ev) => {
              ev.preventDefault();
              props.selectBook(book)}} >
              View Book Detail
            </button>
        </div>
      ))}
    </div>
  );
}

export default BookIndex;
