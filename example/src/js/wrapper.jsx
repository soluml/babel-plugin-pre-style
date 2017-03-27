import React from 'react';

export default class wrapper extends React.Component {
  render() {
    const attrs = {
      div: {
        className: PreStyle`
          color: blue;
        `
      }
    };

    return (<div {...attrs.div}>
      Hello World!
    </div>);
  }
}
