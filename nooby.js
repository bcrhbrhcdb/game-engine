#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { compile } = require('./src/compiler');
const { NoobyRuntime } = require('./src/runtime');

// Set up command-line options
program
  .version('1.0.0')
  .description('Nooby programming language interpreter and compiler')
  .option('-r, --run <file>', 'Run a Nooby file')
  .option('-c, --compile <file>', 'Compile a Nooby file to JavaScript')
  .parse(process.argv);

const options = program.opts();

// Function to read a file safely
function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    process.exit(1);
  }
}

// Execute or compile based on user input
if (options.run) {
  const sourceCode = readFileSafe(options.run);
  const { jsCode } = compile(sourceCode);
  
  const runtime = new NoobyRuntime();
  runtime.execute(jsCode);
} else if (options.compile) {
  const sourceCode = readFileSafe(options.compile);
  const { jsCode } = compile(sourceCode);
  
  const outputFile = options.compile.replace(/\.nb$/, '.js'); // Use regex for safety
  fs.writeFileSync(outputFile, jsCode);
  
  console.log(`Compiled to ${outputFile}`);
} else {
  program.help(); // Show help if no options are provided
}