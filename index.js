/* eslint no-console: 0, global-require: 0, no-cond-assign: 0, import/no-dynamic-require: 0 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const codeFrame = require('babel-code-frame');
const PreStyle = require('pre-style');

module.exports = function BabelPluginPreStyle ({ types: t }) {
  function getConfig(state) {
    const { opts } = state;

    if (!opts.config) {
      throw new Error(`You MUST specify the config option for the "babel-plugin-pre-style" plugin.`);
    }

    const config = Object.assign(
      {},
      require('pre-style/src/js/config'),
      require(path.resolve(opts.config))
    );

    if (!config.destination) {
      throw new Error(`You MUST specify a destination via the config file.`);
    }

    if (!config.outputFile) {
      throw new Error(`You MUST specify an output file via the config file.`);
    }

    if (!config.adapter) {
      throw new Error(`You MUST specify an adapter in the config file or leave it undefined to use the default.`);
    }

    return config;
  }

  return {
    visitor: {
      TaggedTemplateExpression(fpath, state) {
        if (fpath.node.tag.name !== 'PreStyle') return;
        const config = getConfig(state);
        const css = fpath.node.quasi.quasis[0].value.raw;
        const cf = codeFrame(fpath.hub.file.code, fpath.node.loc.start.line, fpath.node.loc.start.column, { highlightCode: true });

        PreStyle(css, config).then((data) => {
          console.log('SUCCESS');
          console.log(data);
        }, (e) => {
          console.log(chalk.red(`The PreStyle Adapter ran into an error: ${chalk.bold(e)}`));
          console.log(cf);
          process.exit();
        });
      },
      JSXElement(fpath, state) {
        if (fpath.node.openingElement.name.name !== 'PreStyle' || fpath.node.closingElement.name.name !== 'PreStyle') return;
        const config = getConfig(state);
        const css = fpath.node.children[0].value;
        const cf = codeFrame(fpath.hub.file.code, fpath.node.loc.start.line, fpath.node.loc.start.column, { highlightCode: true });

        PreStyle(css, config).then((data) => {
          console.log('SUCCESS');
          console.log(data);
        }, (e) => {
          console.log(chalk.red(`The PreStyle Adapter ran into an error: ${chalk.bold(e)}`));
          console.log(cf);
          process.exit();
        });
      }
    }
  };
};
