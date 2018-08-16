import React, { Component } from 'react';
import AuthorIndex from './components/AuthorIndex';
import BookIndex from './components/BookIndex';
import EditBook from './components/EditBook';
import CreateAuthor from './components/CreateAuthor';
import CreateBook from './components/CreateBook';
import Header from './components/Header';
import { 
  fetchAuthors, 
  fetchBooks,
  updateBook,
  saveBook } from './services/api';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentView: 'Author Index',
      selectedBook: '',
      authors: [],
      books: []
    }

    this.createBook = this.createBook.bind(this);
    this.selectBook = this.selectBook.bind(this);
    this.updateBook = this.updateBook.bind(this);
  }

  componentDidMount() {
    fetchAuthors()
      .then(data => this.setState({authors: data.authors}));

    fetchBooks()
      .then(data => this.setState({books: data.books}))
  }

  selectBook(book) {
    this.setState({
      selectedBook: book,
      currentView: 'Edit Book'
    });
  }

  createBook(book) {
    saveBook(book)
      .then(data => fetchBooks())
      .then(data => {
        this.setState({
          currentView: 'Book Index',
          books: data.books
        });
      });
  }

  updateBook(book) {
    updateBook(book)
      .then(data => fetchBooks())
      .then(data => {
        this.setState({
          currentView: 'Book Index',
          books: data.books
        });
      })
  }

  showView() {
    const { currentView } = this.state;
    const { authors, books, selectedBook } = this.state;

    switch (currentView) {
      case 'Author Index':
        return <AuthorIndex />;
        break;
      case 'Create Author':
        return <CreateAuthor />;
        break;
      case 'Create Book':
        return <CreateBook 
          onSubmit={this.createBook}
          authors={authors} />;
        break;
      case 'Edit Book':
        const book = books.find(book => book.book_id === selectedBook.book_id);

        return <EditBook
          onSubmit={this.updateBook}
          authors={authors}
          book={book} />
      case 'Book Index':
        return (
          <BookIndex
            authors={authors}
            selectBook={this.selectBook}
            books={books} />)
          break;
    }
  }

  handleLinkClick(link) {
    this.setState({currentView: link});
  }

  render() {
    const links = [
      'Author Index',
      'Book Index',
      'Create Author',
      'Create Book'
    ];

    return (
      <div className="App">
        <Header 
          onClick={this.handleLinkClick.bind(this)}
          links={links} />
        <h1>Publisher App</h1>
        {this.showView()}
      </div>
    );
  }
}

export default App;
