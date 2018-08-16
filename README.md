# Full Stack _Publisher_ The Cruddening

_Introduction_

Today we'll be taking a deep dive into full-stack _crud_ with Express and React with a focus on Create and Edit.  This is a tall order in one day, but it'll be well worth it at the end.  This lesson comes pre-packaged with an existing app that can be used as a reference as well as providing a basis to hack on additional features.

You will be browsing and adding to a non-trivial codebase.  When making changes, try to verify as quickly as possible that your code is error free and does not have any invalid syntax.  After ensuring that things are working consider committing your code.  If you break something, and just need an escape hatch you can reset to the last commit or in extreme cases just re-clone down the repo and start from scratch.  Things should be modular enough that you won't lose too much critical work.

As a rough guide, the `Book` resource has been more or less built out but the `Author` resource has not (since the latter is a bit simpler).  We'll be glancing at `Book` as a rough guide for how to build out the rest of `Author`.

## Step 0 The Code

The _Publisher_ app is comprised of two resources: a Book resource and an Author resource.  

## The Server

### The Db

Take a look at the schema to see the structure of these two resources:

```sql
CREATE TABLE authors (
  author_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

CREATE TABLE books(
  book_id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  author_id INTEGER NOT NULL REFERENCES authors(author_id),
  title VARCHAR(255)
);
```

Notice how the `books` has an `_author_id` foreign key, but there are no foreign keys on the `authors` table.  This implies that Books has a few more moving parts than Authors, since Books involves working with a JOIN query and depends on Authors.

### `Server.js`

Take a moment to browse through the existing code in the `app` directory.  In `server.js` look at the middleware that is being used.  Also, note how two routers have already been wired up for `Book` and `Author`.

The `cors` middleware is needed since we'll be running two servers to make this app work, viz., one to serve our browser assets (built with React) and another to run our `express` api server.  

[Read more about CORS here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

To wit:

> Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional HTTP headers to tell a browser to let a web application running at one origin (domain) have permission to access selected resources from a server at a different origin. A web application makes a cross-origin HTTP request when it requests a resource that has a different origin (domain, protocol, and port) than its own origin.

> An example of a cross-origin request: The frontend JavaScript code for a web application served from http://domain-a.com uses XMLHttpRequest to make a request for http://api.domain-b.com/data.json.

> For security reasons, browsers restrict cross-origin HTTP requests initiated from within scripts. For example, XMLHttpRequest and the Fetch API follow the same-origin policy. This means that a web application using those APIs can only request HTTP resources from the same origin the application was loaded from, unless the response from the other origin includes the right CORS headers.

### The Routers and Controllers

Next, look at the two routers in `routes/`.  These should feel pretty straightforward.  For this app, the `viewController` has been ommitted in favor of simply rendering a `json` response from the controller.

The only controller methods for getting data from our models should also feel pretty straightforward.

NB: It wouldn't be the end of the world to simply import our models in the router files rather than factoring out a separate controller, but this current pattern (hopefully) fits better with what we've already been doing.

### The Models

Finally, look at the two files in `models/`.

Notice how there is currently not a route/model method for fetching a single resource.  This is (sometimes) not needed since we can fetch everything and store every item in the client and simply pass a single instance of a resource to a component rather than being forced to request data each time we want to change the view that is rendered in the browser.

## The Client

Now let's turn to the React side of our _Publisher_ app.

### The Api Service

Before digging into all the components, first open up `services/api.js` to see the `fetch` calls currently being made.

In particular, look at `fetchBooks` and `updateBook`.  The former fetches all the books.

```javascript
export function fetchBooks() {
  return fetch(`${BASE_URL}/books`)
    .then(resp => resp.json())
    .catch(err => {
      throw Error(err);
    })
}
```

The `fetch` call here relies on a `BASE_URL` defined at the top of the file and uses string interpolation to hit the `/books` path.  Take care not to combine string interpolation with string concatenation, i.e., don't use backticks ` and + operators for building up the string.

`updateBook` is a bit more involved:

```javascript
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
```

Since we're making something other than a "standard" GET request, we have to include an `options` object as the second argument to `fetch`.

The three key/value pairs of the `options` object define different pieces of the PUT request, viz., the method tells the browser that we want to use the `PUT` HTTP verb rather than POST or GET.

The `body` is the data we want to package up and send to the server, and the `Content-Type` header lets express know how to parse the body of the request.  Recall that we are using the `bodyParser.json()` middleware; the "client-side" portion of using a json encoding is specified with the `Content-Type` header.

[Here is a quick overview of headers if you are curious](https://developer.mozilla.org/en-US/docs/Web/API/Headers)

### App.jsx

It's showtime.  Open up `App.jsx` in your editor.  This is a big file, but it's not written in Attic Greek so that's a plus.

As always, a good place to begin getting a handle on this file is the start of the file with all the imports.

```
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
```

After the normal `React` imports, a few components are imported as well as a couple of api methods from the `api` service.  The fetch calls the app needs to make are written in `services/api.js` and then imported one at a time here.

Next, look over the `App` component's constructor

```javascript
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
```

The constructor defines three pieces of state and binds three methods for creating, "selecting", and updating a book.

The `authors` and `books` state arrays should be straightforward. `currentView` deserves a comment.

Since we want to display several different "views" in our app and we haven't covered a way of routing in React yet, we are going to store a string as the name of the current view in `currentView` and then conditionall render the component identified by the `currentView` string.  In this case, there is an `AuthorIndex` component that we will display if and only if the `currentView` is `Author Index`.  The other components for creating and editing an Author and Book can be conditionall rendered using the same pattern.

`selectedBook` stores a single book that should be displayed when the view for showing a single book is being rendered.  We can store a particular book in this part of state and then pass it to the `ShowBook` component.

Moving further down, all books and authors are fetched when the App mounts and the relevant bits of state are updated accordingly.

#### Bound Methods

The next few functions have quite a bit going on.

```
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
```

`selectBook` takes a book as an argument and stores it as the selected book (more on this below).

`createBook` and `updateBook` simply pass data to methods from the api service and then re-fetch all books before setting state to the updated list of books.  This is definitely something of an anti-pattern that you wouldn't use in real life.  Safely updating collections in React has some interesting challenges, so for now we are going to just re-fetch the data from the server.  We'll go over immutable updates soon though!

Also, notice how `createBook` and `updateBook` set the `currentView` to the index.  This allows us to simulate a "redirect" after saving to the db.

the `showView` method abstracts out the conditional rendering for the main view component based on the `currentView` state variable.  It gets the `currentView` out of state and then using a `switch` statement renders one and only one main component, making sure to pass any necessary props down to each component as needed.

#### render()
Finally, the `render` method renders a header with a `handleLinkClick` prop so the `currentView` can be changed as well as the rendered view from `showView()`.

Notice how we can write helper methods that return bits of jsx or components.  It's as if functional components can be build on the fly from within stateful components.

## Step 0.1 Up and Running

Now it's time to set the app up. 

If you haven't already `fork` and `clone` this repo.

- `cd` into the repo
- `cd` into `app`
- run `npm install`
- Look at the `config/conn.js` file to see what database name the app is expecting
- run `createdb publisher_db`
- next, look at `package.json`, especially the `db:create` script
- run `npm run db:create`
- now run `npm run dev` (If all goes well you should get a running Express server)

The server is running on port 3001.  So if we run `curl localhost:3001/books` we should see a list of books in the terminal.

Now, _open a new terminal window_

- `cd` into the `client` directory
- run `yarn install`
- run `yarn start`

You should be able to open up the app in the browser by hitting `http://localhost:3000`

YAY

## Step 1 Let's Start Hacking!

You're going to render a list of authors in the `AuthorIndex` component. Render `AuthorIndex` in the render function of `App.jsx` and pass `authors` that are currently in state in `App.jsx` down as a prop to `AuthorIndex`. The `AuthorIndex` component can now access the array of authors through this prop. Now switch over to `AuthorIndex.jsx`. Map through `props.authors` (or whatever equally semantic name you gave your prop), returning an array of author names. Render the `first_name` and `last_name` of each author. _Don't forget to add a key!_ You can use the `author_id` as your key. You can follow the pattern in the [Star Wars solution](https://git.generalassemb.ly/wdi-nyc-lambda/react-star-wars-homework/blob/solution/star-wars-homework/src/FilmList.jsx) if you get stuck. 

## Step 2 The Create Author Component

Now that we've (hopefully) got AuthorIndex rendering a list of authors, let's add a form for creating new authors.

Take a moment to look at the code on both the browser and the client for creating a new Book. `<breathe>`

Now let's start building out the form in React for creating an Author.  The `CreateAuthor` component has already been started, you just need to pass it the props it needs and then implement the component.

### Desiging our component
What props should we pass?  Notice how `CreateBook` takes two props, viz., `onSubmit` and `authors`.  The `onSubmit` prop is called when the form is getting submitted, and `authors` was needed in order to associate a book with an author.  Since a new Author can stand alone and doesn't need to know anything about `books`, the `CreateAuthor` component only needs a single prop, i.e., `onSubmit`.  The value of `onSubmit` should be a `createAuthor` method.

Analogously to the `createBook` method, `createAuthor` should call a function from the api service to create the new author.  Therefore, the api service needs a `saveAuthor` method just like `saveBook`, and this method should be imported into `App.jsx`.


### Time to Write some Code
That was a handful.  In summary we need to build:


- An api service method, `saveAuthor`
- Export the method from `api.js` and import it in `App.jsx`
- A `createAuthor` method that calls `saveAuthor` and that also sets state appropriately
- A form inside `CreateAuthor` in which a user can enter an Author's `first_name` and `last_name`

And that's just the client side of the problem.  Try to write out this much code, and use the `Network` tab in the DevTools to verify that the correct data is being sent to the server.  Since there is currently no route for creating an author this api call will return a `404`.  Don't fret, we'll get to that next.

Here's a [link](https://git.generalassemb.ly/wdi-nyc-lambda/react-filter/blob/solution/src/FilterableList.jsx) to the `FilterableList` component we saw this morning to remind you how controlled components work. 

## Step 2.5 The Post Author Route

Assuming you can successfully `POST` from the CreateAuthor form with a `first_name` and `last_name` field, it's time to build out the route on the server.

You will need to write the necessary code in the Author router and Authors controller to properly handle the `POST` request to `/authors`.  The model method for `create` has already been written, so one less thing there.

This should be familiar by now.  You got this!
