/* eslint no-console: 0, global-require: 0, no-cond-assign: 0, no-param-reassign: 0, import/no-dynamic-require: 0, no-empty: 1 */

const path = require('path');
const writeFiles = require('pre-style/bin/writeFiles');
const processBlock = require('pre-style/bin/processBlock');

module.exports = function BabelPluginPreStyle ({ types: t }) {
  const classNames = {};
  let css = '';
  let lastWroteLength = -1;
  let config;

  function doPreStyle(fpath, cssStr) {
    let data;

    try {
      data = processBlock(cssStr, config, classNames);
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
          require(path.resolve(this.opts.config))
        );

        if (!config.destination) {
          throw new Error(`You MUST specify a destination via the config file.`);
        }

        if (!config.outputFile) {
          throw new Error(`You MUST specify an output file via the config file.`);
        }

        if (typeof config.adapter !== 'undefined' && typeof config.adapter !== 'string') {
          throw new Error(`You MUST specify a path to your adapter function in the config file or leave it undefined to use the default.`);
        }

        config.nameSpaces = ['PreStyle'].concat(Array.isArray(config.nameSpaces) ? config.nameSpaces : []);
      }
    },
    post() {
      if (lastWroteLength === css.length) return;

      const hasWritten = !!~lastWroteLength;
      lastWroteLength = css.length;

      writeFiles({ css, classNames }, config, hasWritten);
    },
    visitor: {
      TaggedTemplateExpression(fpath) {
        if (!~config.nameSpaces.indexOf(fpath.node.tag.name)) return;

        doPreStyle(fpath, fpath.node.quasi.quasis[0].value.raw);
      }
    }
  };
};
