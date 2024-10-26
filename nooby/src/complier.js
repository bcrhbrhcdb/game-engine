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
      // Assuming the last child is the body of the function
      const params = node.children.slice(0, -1).map(generateCode).join(', ');
      const body = generateCode(node.children[node.children.length - 1]);
      return `function ${node.value}(${params}) {\n${body}\n}`;

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

    // Add more cases for other node types as needed
    case 'BinaryExpression':
      return `${generateCode(node.left)} ${node.operator} ${generateCode(node.right)}`;

    default:
      throw new Error(`Unknown node type: ${node.type}`);
  }
}

module.exports = { compile };