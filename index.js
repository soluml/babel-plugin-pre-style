/* eslint no-console: 0, global-require: 0, no-cond-assign: 0, no-param-reassign: 0, import/no-dynamic-require: 0 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const union = require('lodash/union');
const flattenDeep = require('lodash/flattenDeep');
const codeFrame = require('babel-code-frame');
const PreStyle = require('pre-style');

module.exports = function BabelPluginPreStyle ({ types: t }) {
  const toBeWritten = [];
  let lastWroteLength = 0;
  let config;

  return {
    pre() {
      if (!config) {
        if (!this.opts.config) {
          throw new Error(`You MUST specify the config option for the "babel-plugin-pre-style" plugin.`);
        }

        config = Object.assign(
          {},
          require('pre-style/src/js/config'),
          require(path.resolve(this.opts.config))
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
      }
    },
    post() {
      if (toBeWritten.length === 0 || lastWroteLength === toBeWritten.length) return;
      lastWroteLength = toBeWritten.length;

      try {
        fs.mkdirSync(path.resolve(config.destination));
      } catch (e) {}

      const cssContent = toBeWritten.map(cssObj => cssObj.css).join('');
      const classnameContent = JSON.stringify(union(flattenDeep(toBeWritten.map(cssObj => cssObj.classNames.split(' ')))));

      fs.writeFileSync(path.resolve(config.destination, config.outputFile), cssContent);
      console.log(`${chalk.green('File')} ${chalk.cyan(path.basename(config.outputFile))} ${chalk.green('created.')}`);

      fs.writeFileSync(path.resolve(config.destination, `${config.outputFile}.classNames.json`), classnameContent);
      console.log(`${chalk.green('File')} ${chalk.cyan(path.basename(`${config.outputFile}.classNames.json`))} ${chalk.green('created.')}`);
    },
    visitor: {
      TaggedTemplateExpression(fpath) {
        if (fpath.node.tag.name !== 'PreStyle') return;

        const css = fpath.node.quasi.quasis[0].value.raw;
        const cf = codeFrame(fpath.hub.file.code, fpath.node.loc.start.line, fpath.node.loc.start.column, { highlightCode: true });

        PreStyle(css, config).then((data) => {
          toBeWritten.push(data);
          fpath.replaceWith(t.StringLiteral(data.classNames));
        }, (e) => {
          console.log(chalk.red(`The PreStyle ran into an error:\r\n${chalk.bold(e)}`));
          console.log(cf);
          process.exit();
        });
      },
      JSXElement(fpath) {
        if (fpath.node.openingElement.name.name !== 'PreStyle' || fpath.node.closingElement.name.name !== 'PreStyle') return;

        const css = fpath.node.children[0].value;
        const cf = codeFrame(fpath.hub.file.code, fpath.node.loc.start.line, fpath.node.loc.start.column, { highlightCode: true });

        PreStyle(css, config).then((data) => {
          toBeWritten.push(data);
          fpath.replaceWith(t.StringLiteral(data.classNames));
        }, (e) => {
          console.log(chalk.red(`The PreStyle ran into an error:\r\n${chalk.bold(e)}`));
          console.log(cf);
          process.exit();
        });
      }
    }
  };
};
