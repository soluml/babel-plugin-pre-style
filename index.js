const fs = require('fs');
const path = require('path');
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
      /*
      Identifier(fpath, state) {
        if (fpath.node.name !== 'PreStyle') return;

        //processCode(state);
        console.log('NORMAL:');
        console.log(fpath.node);
      },
      */
      JSXElement(fpath, state) {
        if (fpath.node.openingElement.name.name !== 'PreStyle' || fpath.node.closingElement.name.name !== 'PreStyle') return;
        const config = getConfig(state);

        console.log('JSX:');
        console.log(fpath.node);
        console.log('Config:');
        console.log(config);
      }
    }
  };
};
