import React, { Component } from 'react';

class EditBook extends Component {
  constructor(props) {
    super(props);

    const { book, author_id } = props;
    this.state = {
      title: book.title,
      author_id: book.author_id
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const data = {
      title: this.state.title,
      author_id: this.state.author_id,
      book_id: this.props.book.book_id
    }
    this.props.onSubmit(data);
  }

  handleChange(ev) {
    ev.preventDefault();
    const { name, value } = ev.target;

    this.setState({
      [name]: value
    });
  }

  parseAuthorOptions(authors) {
    return authors.map(author => ({
      value: author.author_id,
      display: `${author.first_name} ${author.last_name}`
    }));
  }

  render() {
    const { title, author_id } = this.state;
    const { authors } = this.props;
    const options = this.parseAuthorOptions(authors);

    return (
      <div>
        <h2>Edit Book</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            name="title"
            value={this.state.title}
            onChange={this.handleChange} />

          <select
            value={this.state.author_id}
            onChange={this.handleChange}
            name="author_id"
          >
            {options.map(author => (
              <option 
                key={author.value}
                value={author.value}>
                {author.display}
              </option>
            ))}
          </select>

          <input type="submit" value="Update Book" />
        </form>
      </div>
    );
  }
}

export default EditBook;
