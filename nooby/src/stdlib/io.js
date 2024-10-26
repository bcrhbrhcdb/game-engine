const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = {
  print: console.log,
  readLine: (question) => new Promise((resolve) => rl.question(question, resolve)),
  readNumber: async (question) => {
    const input = await module.exports.readLine(question);
    return parseFloat(input);
  }
};