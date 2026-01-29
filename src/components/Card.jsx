import React from 'react';

function Card({ children, ...props }) {
  return (
    <div {...props}>
      {children}
    </div>
  );
}

export default Card;
