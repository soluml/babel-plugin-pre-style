const path = require('path');
const PreStyle = require('pre-style');

const { css, config } = process.env;

PreStyle(
  css,
  Object.assign(
    {},
    require('pre-style/src/js/config'),
    require(path.resolve(config))
  )
).then(
  data => process.stdout.write(JSON.stringify(data)),
  (e) => {
    throw new Error(`Pre-Style ran into an error:\r\n${e}`);
  }
);
