import * as React from 'react';

const SvgTodo = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    xmlSpace="preserve"
    role="img"
    {...props}
  >
    <path d="m26.207 21.707-4 4a1 1 0 0 1-1.414 0l-1.5-1.5a1 1 0 0 1 1.414-1.414l.793.793 3.293-3.293a1 1 0 0 1 1.414 1.414z" />
    <path
      clipRule="evenodd"
      d="M19 4h-8V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v19a3 3 0 0 0 3 3h14.392A7 7 0 0 0 28 18.101V7a3 3 0 0 0-3-3h-1V3a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1zM5 27h12.255A7 7 0 0 1 26 16.674V12H4v14a1 1 0 0 0 1 1zM8.5 9A2.5 2.5 0 0 1 6 6.5V6H5a1 1 0 0 0-1 1v3h22V7a1 1 0 0 0-1-1h-1v.5a2.5 2.5 0 0 1-5 0V6h-8v.5A2.5 2.5 0 0 1 8.5 9zM8 6.5a.5.5 0 0 0 1 0V4H8zm13 0a.5.5 0 0 0 1 0V4h-1zM23 18a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
      fillRule="evenodd"
    />
  </svg>
);

export default SvgTodo;
