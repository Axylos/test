import React from 'react';

function Header(props) {
  const { links } = props;
  return (
    <div className="header">
        {links.map(link => {
          return <div 
            key={link}
            className="link" 
            onClick={() => props.onClick(link)}
          >{link}</div>
        })}
    </div>
  );
}

export default Header;
