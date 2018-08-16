import React, { Component } from 'react';

class CreateBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      author_id: '' 
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(ev) {
    ev.preventDefault();
    this.props.onSubmit(this.state);
  }

  handleChange(ev) {
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
    const { authors } = this.props;
    const options = this.parseAuthorOptions(authors);

    return (
      <div>
        <h2>Create Book</h2>
        <form onSubmit={this.handleSubmit} >
          <input
            type="text" 
            name="title"
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
          

          <input type="submit" value="Create Book" />
        </form>
      </div>
    );
  }
}

export default CreateBook;
