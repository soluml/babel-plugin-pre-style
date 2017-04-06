import React from 'react';

function joinCSSClasses(...classStrs) {
  //This function takes a series of class strings and joins them together in a single string.
  //For another option, check out the awesome classnames package: https://www.npmjs.com/package/classnames
  return classStrs
    .filter(classStr => classStr)
    .join(' ');
}

export default class wrapper extends React.Component {
  constructor() {
    super();
    this.state = { tick: 0 };
  }

  render() {
    const tickMod = this.state.tick % 3;
    const attrs = {
      h1: {
        className: joinCSSClasses(
          //The following returns: "A B C"
          PreStyle`
            font-weight: bold;
            text-align: center;
            transition: color .35s ease-in;
          `,
          (tickMod === 0 && PreStyle`color: $color1;`), //Returns: "D"
          (tickMod === 1 && PreStyle`color: $color2;`), //Returns: "E"
          (tickMod === 2 && PreStyle`color: $color3;`)  //Returns: "F"
        )
      }
    };

    return (<h1 {...attrs.h1}>
      Hello World!
    </h1>);
  }

  componentDidMount() {
    this.loadInterval = setInterval(() => {
      this.setState({ tick: this.state.tick + 1 });
    }, 1000);
  }

  componentWillUnmount () {
    if (this.loadInterval) clearInterval(this.loadInterval);
    this.loadInterval = false;
  }
}
