import React from 'react';

function displayName(author) {
  return `${author.first_name} ${author.last_name}`
}

export default (props) => {
  return (
    <div>
      <h2>Author index</h2>
      <div>
        {props.authors.map(author => (
          <div key={author.author_id}>{displayName(author)}</div>
        ))}
      </div>
    </div>
  )
}
