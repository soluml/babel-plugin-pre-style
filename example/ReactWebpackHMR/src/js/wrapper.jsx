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
          //The following initially returns: "A B C D E F"
          PreStyle`
            @include overflow-text-boundry(); //<- Using a Sass mixin from our _vars Sass partial
            font-weight: bold;
            text-align: center;
            transition: color .35s ease-in;
          `,
          (tickMod === 0 && PreStyle`color: $color1;`), //Initially returns: "G"; $color1 is in our _vars Sass partial
          (tickMod === 1 && PreStyle`color: $color2;`), //Initially returns: "H"; $color2 is in our _vars Sass partial
          (tickMod === 2 && PreStyle`color: $color3;`)  //Initially returns: "I"; $color3 is in our _vars Sass partial
        )
      },
      h2: {
        //The following initially returns "D E", because we've already used these properties before. Your properties are completely reusable without bloating the resulting CSS file or JS files... Pre-Style just strips out unused styles.
        className: PreStyle`
          font-weight: bold;
          text-align: center;
        `
      }
    };

    return (<main>
      <h1 {...attrs.h1}>Hello World!</h1>
      <h2 {...attrs.h2}>This is a React + Pre-Style + Webpack + Hot Module Reloading demo</h2>
    </main>);
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
