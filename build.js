const fs = require('fs');
const path = require('path');
const { compile } = require('./src/compiler');

const examplesDir = path.join(__dirname, 'examples');
const docsDir = path.join(__dirname, 'docs');

if (!fs.existsSync(docsDir)) {
 fs.mkdirSync(docsDir);
}

fs.readdirSync(examplesDir).forEach(file => {
 if (path.extname(file) === '.nb') {
   const sourceCode = fs.readFileSync(path.join(examplesDir, file), 'utf8');
   const { jsCode } = compile(sourceCode);
   const mdContent = `
# ${file}

## Nooby Code

\`\`\`nooby
${sourceCode}
\`\`\`

## Compiled JavaScript

\`\`\`javascript
${jsCode}
\`\`\`
`;
   fs.writeFileSync(path.join(docsDir, `${path.basename(file, '.nb')}.md`), mdContent);
 }
});

const indexContent = `
# Nooby Language Examples

${fs.readdirSync(examplesDir)
 .filter(file => path.extname(file) === '.nb')
 .map(file => `- [${file}](${path.basename(file, '.nb')}.md)`)
 .join('\n')}
`;

fs.writeFileSync(path.join(docsDir, 'index.md'), indexContent);