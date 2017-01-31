const fs = require('fs');
const path = require('path');
const PreStyle = require('pre-style');

module.exports = function BabelPluginPreStyle ({ types: t }) {
  function processCode(state) {
    const { opts } = state;

    if (!opts.config) {
      //For nice code hint errors use: `throw fpath.buildCodeFrameError(...msg...)`
      throw new Error(`You MUST specify the config option for the "babel-plugin-pre-style" plugin.`);
    }

    this.config = Object.assign(
      {},
      require('pre-style/src/js/config'),
      require(path.resolve(opts.config))
    );

    if (!this.config.destination) {
      throw new Error(`You MUST specify a destination via the config file.`);
    }

    if (!this.config.outputFile) {
      throw new Error(`You MUST specify an output file via the config file.`);
    }

    if (!this.config.adapter) {
      throw new Error(`You MUST specify an adapter in the config file or leave it undefined to use the default.`);
    }

    //console.log('CONFIG');
    //console.log(this.config);
  }

  return {
    visitor: {
      JSXIdentifier(fpath, state) {
        if (fpath.node.name !== 'PreStyle') return;

        processCode(state);
        console.log('OTHER:');
        console.log(fpath);
      }
    }
  };
};
