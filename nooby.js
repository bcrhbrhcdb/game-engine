const fs = require('fs');
const path = require('path');
const { compile } = require('./src/compiler');
const { NoobyRuntime } = require('./src/runtime');

async function runNoobyFile(filename) {
  const sourceCode = fs.readFileSync(filename, 'utf8');
  const compiledCode = compile(sourceCode);
  const runtime = new NoobyRuntime();
  await runtime.execute(compiledCode);
}

const filename = process.argv[2];
if (!filename) {
  console.error('Please provide a .nb file to run.');
  process.exit(1);
}

runNoobyFile(filename).catch(console.error);