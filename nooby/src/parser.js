const { TOKEN_TYPES } = require('./lexer');

class ASTNode {
  constructor(type, value, children = []) {
    this.type = type;
    this.value = value;
    this.children = children;
  }
}

function parse(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === TOKEN_TYPES.NUMBER) {
      current++;
      return new ASTNode('NumberLiteral', token.value);
    }

    if (token.type === TOKEN_TYPES.STRING) {
      current++;
      return new ASTNode('StringLiteral', token.value);
    }

    if (token.type === TOKEN_TYPES.IDENTIFIER) {
      current++;
      return new ASTNode('Identifier', token.value);
    }

    if (token.type === TOKEN_TYPES.KEYWORD) {
      if (token.value === 'func') {
        let node = new ASTNode('FunctionDeclaration', null);
        current++;

        token = tokens[current];
        if (token.type !== TOKEN_TYPES.IDENTIFIER) {
          throw new TypeError('Expected function name.');
        }

        node.value = token.value;
        current++;

        token = tokens[current];
        if (token.type !== TOKEN_TYPES.PUNCTUATION || token.value !== '(') {
          throw new TypeError('Expected opening parenthesis.');
        }
        current++;

        node.children = [];
        while (
          tokens[current].type !== TOKEN_TYPES.PUNCTUATION ||
          tokens[current].value !== ')'
        ) {
          node.children.push(walk());
          if (tokens[current].type === TOKEN_TYPES.PUNCTUATION && tokens[current].value === ',') {
            current++;
          }
        }
        current++;

        token = tokens[current];
        if (token.type !== TOKEN_TYPES.PUNCTUATION || token.value !== '{') {
          throw new TypeError('Expected opening brace.');
        }
        current++;

        node.children.push(walk());

        return node;
      }

      if (token.value === 'return') {
        let node = new ASTNode('ReturnStatement', null);
        current++;
        node.children = [walk()];
        return node;
      }

      // Add more keyword handling here (if, while, for, etc.)
    }

    if (token.type === TOKEN_TYPES.PUNCTUATION && token.value === '{') {
      let node = new ASTNode('BlockStatement', null);
      node.children = [];
      current++;

      while (
        tokens[current].type !== TOKEN_TYPES.PUNCTUATION ||
        tokens[current].value !== '}'
      ) {
        node.children.push(walk());
      }
      current++;

      return node;
    }

    throw new TypeError(`Unexpected token: ${token.value}`);
  }

  let ast = new ASTNode('Program', null, []);
  while (current < tokens.length) {
    ast.children.push(walk());
  }

  return ast;
}

module.exports = { parse, ASTNode };