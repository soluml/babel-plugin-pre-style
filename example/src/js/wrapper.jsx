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
          PreStyle`
            font-weight: bold;
            text-align: center;
            transition: color .115s ease-in;
          `,
          (tickMod === 0 && PreStyle`color: red;`),
          (tickMod === 1 && PreStyle`color: blue;`),
          (tickMod === 2 && PreStyle`color: green;`)
        ].join(' ')
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
