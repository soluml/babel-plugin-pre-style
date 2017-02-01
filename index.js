/* eslint no-console: 0, global-require: 0, no-cond-assign: 0, import/no-dynamic-require: 0 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const union = require('lodash/union');
const flattenDeep = require('lodash/flattenDeep');
const codeFrame = require('babel-code-frame');
const PreStyle = require('pre-style');

module.exports = function BabelPluginPreStyle ({ types: t }) {
  const writer = {
    cssObjsToWrite: []
  };

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

    writer.config = config;
    return config;
  }

  function writeToFile() {
    const cssObjs = writer.cssObjsToWrite.concat([]);
    writer.cssObjsToWrite = [];

    fs.mkdir(path.resolve(writer.config.destination), () => {
      const cssContent = cssObjs.map(cssObj => cssObj.css).join('');
      const classnameContent = JSON.stringify(union(flattenDeep(cssObjs.map(cssObj => cssObj.classNames.split(' ')))));

      console.log('SUCCESS', cssContent);

      fs.writeFile(path.resolve(writer.config.destination, writer.config.outputFile), cssContent, (err) => {
        if (err) throw err;
        console.log(`${chalk.green('File')} ${chalk.cyan(path.basename(writer.config.outputFile))} ${chalk.green('created.')}`);
      });

      fs.writeFile(path.resolve(writer.config.destination, `${writer.config.outputFile}.classNames.json`), classnameContent, (err) => {
        if (err) throw err;
        console.log(`${chalk.green('File')} ${chalk.cyan(path.basename(`${writer.config.outputFile}.classNames.json`))} ${chalk.green('created.')}`);
      });
    });
  }

  return {
    visitor: {
      TaggedTemplateExpression(fpath, state) {
        if (fpath.node.tag.name !== 'PreStyle') return;
        const config = getConfig(state);
        const css = fpath.node.quasi.quasis[0].value.raw;
        const cf = codeFrame(fpath.hub.file.code, fpath.node.loc.start.line, fpath.node.loc.start.column, { highlightCode: true });

        PreStyle(css, config).then((data) => {
          writer.cssObjsToWrite.push(data);
        }, (e) => {
          console.log(chalk.red(`The PreStyle ran into an error:\r\n${chalk.bold(e)}`));
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
          writer.cssObjsToWrite.push(data);
        }, (e) => {
          console.log(chalk.red(`The PreStyle ran into an error:\r\n${chalk.bold(e)}`));
          console.log(cf);
          process.exit();
        });
      }
    },
    post() {
      if (writer.cssObjsToWrite.length) writeToFile();
      console.log('TEST');
    }
  };
};
