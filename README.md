# babel-plugin-pre-style

```
npm install --save babel-plugin-pre-style
```

[![npm version](https://badge.fury.io/js/babel-plugin-pre-style.svg)](http://badge.fury.io/js/babel-plugin-pre-style)

This is the Babel Plugin for Pre-Style. Refer to the [root project](https://github.com/soluml/pre-style) for configuration options and general information.

To use with Babel, add the following to your `.babelrc` file:

```
{
  "plugins": [
    ["pre-style", { "config": "path/to/PreStyleConfig.js" }]
  ]
}
```

## Examples

#### With React:
- This example features a simple "Hello World" React application. We use PreStyle in the [wrapper.jsx file](/example/src/js/wrapper.jsx) to set the base styles for a <h1> tag and then change the color once a second. You can see the source for that [here](/example).
