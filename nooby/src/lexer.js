const TOKEN_TYPES = {
    KEYWORD: 'KEYWORD',
    IDENTIFIER: 'IDENTIFIER',
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    OPERATOR: 'OPERATOR',
    PUNCTUATION: 'PUNCTUATION',
    COMMENT: 'COMMENT'
  };
  
  const KEYWORDS = ['func', 'if', 'else', 'while', 'for', 'return', 'import', 'class', 'new'];
  
  function tokenize(code) {
    const tokens = [];
    let current = 0;
  
    while (current < code.length) {
      let char = code[current];
  
      // Handle whitespace
      if (/\s/.test(char)) {
        current++;
        continue;
      }
  
      // Handle comments
      if (char === '/' && code[current + 1] === '/') {
        let comment = '';
        current += 2;
        while (code[current] !== '\n' && current < code.length) {
          comment += code[current];
          current++;
        }
        tokens.push({ type: TOKEN_TYPES.COMMENT, value: comment });
        continue;
      }
  
      // Handle strings
      if (char === '"') {
        let string = '';
        current++;
        while (code[current] !== '"' && current < code.length) {
          string += code[current];
          current++;
        }
        current++;
        tokens.push({ type: TOKEN_TYPES.STRING, value: string });
        continue;
      }
  
      // Handle numbers
      if (/[0-9]/.test(char)) {
        let number = '';
        while (/[0-9]/.test(code[current])) {
          number += code[current];
          current++;
        }
        tokens.push({ type: TOKEN_TYPES.NUMBER, value: parseInt(number) });
        continue;
      }
  
      // Handle identifiers and keywords
      if (/[a-zA-Z_]/.test(char)) {
        let identifier = '';
        while (/[a-zA-Z0-9_]/.test(code[current])) {
          identifier += code[current];
          current++;
        }
        const type = KEYWORDS.includes(identifier) ? TOKEN_TYPES.KEYWORD : TOKEN_TYPES.IDENTIFIER;
        tokens.push({ type, value: identifier });
        continue;
      }
  
      // Handle operators
      if (/[+\-*\/=<>!&|]/.test(char)) {
        let operator = char;
        current++;
        if (/[=&|]/.test(code[current])) {
          operator += code[current];
          current++;
        }
        tokens.push({ type: TOKEN_TYPES.OPERATOR, value: operator });
        continue;
      }
  
      // Handle punctuation
      if (/[(){}[\],.]/.test(char)) {
        tokens.push({ type: TOKEN_TYPES.PUNCTUATION, value: char });
        current++;
        continue;
      }
  
      throw new Error(`Unexpected character: ${char}`);
    }
  
    return tokens;
  }
  
  module.exports = { tokenize, TOKEN_TYPES };