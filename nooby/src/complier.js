const { parse } = require('./parser');
const { tokenize } = require('./lexer');

function compile(sourceCode) {
  const tokens = tokenize(sourceCode);
  const ast = parse(tokens);
  const jsCode = generateCode(ast);
  return { jsCode };
}

function generateCode(node) {
  switch (node.type) {
    case 'Program':
      return node.children.map(generateCode).join('\n');

    case 'FunctionDeclaration':
      return `function ${node.value}(${node.children.map(generateCode).join(', ')}) {\n${generateCode(node.body)}\n}`;

    case 'BlockStatement':
      return node.children.map(generateCode).join('\n');

    case 'ReturnStatement':
      return `return ${generateCode(node.argument)};`;

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