import React from 'react';

export default class wrapper extends React.Component {
  render() {
    const attrs = {
      div: {
        className: PreStyle`
          color: blue;
          font-weight: bold;
          text-align: center;
        `
      }
    };

    return (<div {...attrs.div}>
      Hello World!
    </div>);
  }
}
