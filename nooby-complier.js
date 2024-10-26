const fs = require('fs');
const path = require('path');

function compile(sourceFile) {
  const source = fs.readFileSync(sourceFile, 'utf8');
  const ast = parse(source);
  const { html, css, js } = generate(ast);

  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
  fs.writeFileSync(path.join(outputDir, 'styles.css'), css);
  fs.writeFileSync(path.join(outputDir, 'script.js'), js);

  console.log('Compilation complete. Output files generated in the "output" directory.');
}

function parse(source) {
  const lines = source.split('\n').map(line => line.trim()).filter(line => line.length > 0 && !line.startsWith('//'));
  const ast = { page: '', style: {}, content: [], variables: {}, functions: {} };
  let currentSection = 'content';

  for (const line of lines) {
    if (line.startsWith('page ')) {
      ast.page = line.slice(6).replace(/"/g, '');
    } else if (line === 'style {') {
      currentSection = 'style';
    } else if (line.startsWith('func ')) {
      const funcName = line.match(/func (\w+)/)[1];
      ast.functions[funcName] = { params: line.match(/\((.*?)\)/)[1].split(','), body: [] };
      currentSection = 'function';
    } else if (line === '}') {
      currentSection = 'content';
    } else if (currentSection === 'style') {
      const [selector, rules] = line.split(':');
      ast.style[selector.trim()] = rules.split(',').map(rule => rule.trim());
    } else if (currentSection === 'function') {
      const currentFunc = Object.keys(ast.functions).pop();
      ast.functions[currentFunc].body.push(line);
    } else {
      ast.content.push(line);
    }
  }

  return ast;
}

function generate(ast) {
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ast.page}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${generateContent(ast.content)}
  <script src="script.js"></script>
</body>
</html>
  `.trim();

  let css = Object.entries(ast.style).map(([selector, rules]) => {
    return `${selector} {\n  ${rules.join(';\n  ')};\n}`;
  }).join('\n\n');

  let js = `
${generateVariables(ast.variables)}

${generateFunctions(ast.functions)}

${generateContentJS(ast.content)}
  `.trim();

  return { html, css, js };
}

function generateContent(content) {
  return content.map(line => {
    if (line.startsWith('h1 ')) {
      return `<h1>${line.slice(3).replace(/"/g, '')}</h1>`;
    } else if (line.startsWith('p ')) {
      return `<p>${line.slice(2).replace(/"/g, '')}</p>`;
    }
    return '';
  }).join('\n');
}

function generateVariables(variables) {
  return Object.entries(variables).map(([name, value]) => {
    return `let ${name} = ${value};`;
  }).join('\n');
}

function generateFunctions(functions) {
  return Object.entries(functions).map(([name, func]) => {
    return `function ${name}(${func.params.join(', ')}) {\n  ${func.body.join('\n  ')}\n}`;
  }).join('\n\n');
}

function generateContentJS(content) {
  return content.map(line => {
    if (line.startsWith('print ')) {
      return `console.log(${line.slice(6)});`;
    } else if (line.startsWith('if ')) {
      return line.replace('if', 'if ');
    } else if (line.startsWith('repeat ')) {
      const [_, count, body] = line.match(/repeat (\d+) \{(.*)\}/);
      return `for (let i = 0; i < ${count}; i++) {\n  ${body.trim()}\n}`;
    } else if (line.includes('(')) {
      return line + ';';
    }
    return '';
  }).join('\n');
}

module.exports = { compile };