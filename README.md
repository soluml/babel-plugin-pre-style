# babel-plugin-pre-style

```
npm install --save babel-plugin-pre-style
```

[![npm version](https://badge.fury.io/js/babel-plugin-pre-style.svg)](http://badge.fury.io/js/babel-plugin-pre-style)

This is the Babel Plugin for Pre-Style. Refer to the [root project](https://github.com/soluml/pre-style) for configuration options and general information. **Note:** This plugin does not work with the command line options of the original tool. You must use and specify a config file.

To use with Babel, add the following to your `.babelrc` file:

```
{
  "plugins": [
    ["pre-style", { "config": "path/to/PreStyleConfig.js" }]
  ]
}
```

## Examples

#### With React, Webpack, and Hot Module Reloading:
- This example features a simple "Hello World" React application. We use Pre-Style in the [wrapper.jsx file](/example/ReactWebpackHMR/src/js/wrapper.jsx) to set the base styles for a `<h1>` tag and then change the color once a second. To see the example, download the example folder and do a `npm install`. Once all the dependencies have loaded, simply run `npm start`. The example features Hot Module Reloading so you can play with the markup and Pre-Style live. The source for this example is [here](/example/ReactWebpackHMR).
