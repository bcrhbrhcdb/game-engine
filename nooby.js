const { compile } = require('./nooby-compiler');

const sourceFile = process.argv[2];

if (!sourceFile) {
  console.error('Please provide a .nb file to compile.');
  process.exit(1);
}

compile(sourceFile);