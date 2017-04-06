import React from 'react';

export default class wrapper extends React.Component {
  constructor() {
    super();
    this.state = { tick: 0 };
  }

  render() {
    const tickMod = this.state.tick % 3;
    const attrs = {
      h1: {
        className: [
          //The following returns: "A B C"
          PreStyle`
            font-weight: bold;
            text-align: center;
            transition: color .115s ease-in;
          `,
          (tickMod === 0 && PreStyle`color: red;`),  //Returns: "D"
          (tickMod === 1 && PreStyle`color: blue;`), //Returns: "E"
          (tickMod === 2 && PreStyle`color: green;`) //Returns: "F"
        ].filter(str => str).join(' ')               //Filter out the "false" and join the classnames together into one string
      }
    };

    return (<h1 {...attrs.h1}>
      Hello World!
    </h1>);
  }

  componentDidMount() {
    const tickFn = () => {
      setTimeout(() => {
        this.setState({ tick: this.state.tick + 1 });
        tickFn();
      }, 1000);
    };

    tickFn();
  }
}
