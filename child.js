const path = require('path');
const PreStyle = require('pre-style');

const { css, config, existing_strings } = process.env;

PreStyle(
  css,
  Object.assign(
    {},
    require('pre-style/src/js/config'),
    require(path.resolve(config))
  ),
  JSON.parse(existing_strings)
).then(
  data => process.stdout.write(JSON.stringify(data)),
  (e) => {
    throw new Error(`Pre-Style ran into an error:\r\n${e}`);
  }
);
