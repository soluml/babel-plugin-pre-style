/* eslint no-console: 0, global-require: 0, no-cond-assign: 0, no-param-reassign: 0, import/no-dynamic-require: 0, no-empty: 1 */

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const util = require('util');
const chalk = require('chalk');

module.exports = function BabelPluginPreStyle ({ types: t }) {
  const classNames = {};
  let css = '';
  let lastWroteLength = -1;
  let config;

  function doPreStyle(fpath, cssStr, configFileName) {
    let data;

    try {
      const existing_strings = JSON.stringify(classNames);

      data = execSync(
        `node ${path.resolve(__dirname, 'child.js')}`,
        {
          timeout: 60000,
          env: Object.assign({}, process.env, { css: cssStr, config: configFileName, existing_strings })
        }
      );
      data = JSON.parse(data);
    } catch (e) {
      throw fpath.buildCodeFrameError(e);
    }

    Object.assign(classNames, data.classNames);
    css += data.css;
    fpath.replaceWith(t.StringLiteral(Object.keys(data.classNames).map(key => data.classNames[key]).join(' ')));
  }

  return {
    pre() {
      if (!config) {
        if (!this.opts.config) {
          throw new Error(`You MUST specify the config option for the "babel-plugin-pre-style" plugin.`);
        }

        config = Object.assign(
          {},
          require('pre-style/src/module/config'),
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
      if (lastWroteLength === css.length) return;
      lastWroteLength = css.length;

      try {
        fs.mkdirSync(path.resolve(config.destination));
      } catch (e) {}

      fs.writeFileSync(path.resolve(config.destination, config.outputFile), css);
      console.log(`${chalk.green('File')} ${chalk.cyan(path.basename(config.outputFile))} ${chalk.green('created.')}`);

      fs.writeFileSync(path.resolve(config.destination, `${config.outputFile}.classNames.js`), `module.exports = ${util.inspect(classNames)};`);
      console.log(`${chalk.green('File')} ${chalk.cyan(path.basename(`${config.outputFile}.classNames.js`))} ${chalk.green('created.')}`);
    },
    visitor: {
      TaggedTemplateExpression(fpath) {
        if (fpath.node.tag.name !== 'PreStyle') return;

        doPreStyle(fpath, fpath.node.quasi.quasis[0].value.raw, this.opts.config);
      },
      JSXElement(fpath) {
        if (fpath.node.openingElement.name.name !== 'PreStyle' || fpath.node.closingElement.name.name !== 'PreStyle') return;

        doPreStyle(fpath, fpath.node.children[0].value, this.opts.config);
      }
    }
  };
};
