#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { compile } = require('./src/compiler');
const { NoobyRuntime } = require('./src/runtime');

program
  .version('1.0.0')
  .description('Nooby programming language')
  .option('-r, --run <file>', 'Run a Nooby file')
  .option('-c, --compile <file>', 'Compile a Nooby file to JavaScript')
  .parse(process.argv);

const options = program.opts();

if (options.run) {
  const sourceCode = fs.readFileSync(options.run, 'utf8');
  const { jsCode } = compile(sourceCode);
  const runtime = new NoobyRuntime();
  runtime.execute(jsCode);
} else if (options.compile) {
  const sourceCode = fs.readFileSync(options.compile, 'utf8');
  const { jsCode } = compile(sourceCode);
  const outputFile = options.compile.replace('.nb', '.js');
  fs.writeFileSync(outputFile, jsCode);
  console.log(`Compiled to ${outputFile}`);
} else {
  program.help();
}