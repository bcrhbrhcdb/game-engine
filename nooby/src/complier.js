const { parse } = require('./parser');
const { tokenize } = require('./lexer');

function compile(sourceCode) {
  const tokens = tokenize(sourceCode);
  const ast = parse(tokens);
  return generateCode(ast);
}

function generateCode(node) {
  switch (node.type) {
    case 'Program':
      return node.children.map(generateCode).join('\n');

    case 'FunctionDeclaration':
      return `function ${node.value}(${node.children.slice(0, -1).map(generateCode).join(', ')}) {
        ${generateCode(node.children[node.children.length - 1])}
      }`;

    case 'BlockStatement':
      return node.children.map(generateCode).join('\n');

    case 'ReturnStatement':
      return `return ${generateCode(node.children[0])};`;

    case 'Identifier':
      return node.value;

    case 'NumberLiteral':
      return node.value.toString();

    case 'StringLiteral':
      return `"${node.value}"`;

    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

module.exports = { compile };