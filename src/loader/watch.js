'use strict';

const ts = require('typescript');
const generator = require('babel-generator').default;
const transformer = require('bisheng-plugin-react/lib/transformer');
const utils = require('../utils');

module.exports = function watch(tsCode) {
  if (this.cacheable) {
    this.cacheable();
  }

  const es6Code = ts.transpileModule(tsCode, {
    compilerOptions: {
      jsx: 'preserve',
      target: 'es6'
    },
  }).outputText;
  const highlightedCode = {
    es6: Prism.highlight(es6Code, Prism.languages.jsx),
    ts: Prism.highlight(tsCode, Prism.languages.typescript),
  };
  const preprocessedCode = JSON.stringify(utils.getPreview(es6Code));
  const res = transformer(preprocessedCode, '__react');
  const preview = generator(res.inputAst, null, preprocessedCode).code;
  res.inputAst.program.body = res.imports;
  const imports = generator(res.inputAst, null, preprocessedCode).code;

  return `${imports}\n` +
    'module.exports = {\n' +
    `  highlightedCode: ${JSON.stringify(highlightedCode)},\n` +
    `  preview: ${preview}` +
    '\n}';
}
