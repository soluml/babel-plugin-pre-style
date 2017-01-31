const fs = require('fs');
const path = require('path');
const PreStyle = require('pre-style');

module.exports = function BabelPluginPreStyle ({ types: t }) {
  return {
    visitor: {
      JSXAttribute(fpath, state) {
        const { opts } = state;

        console.log(fpath.node.name, opts);
      }
    }
  };
};
