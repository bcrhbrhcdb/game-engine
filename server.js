const express = require('express');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { compile } = require('./src/compiler');
const { NoobyRuntime } = require('./src/runtime');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/run/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'examples', filename);

  try {
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    const compiledCode = compile(sourceCode);
    const runtime = new NoobyRuntime();
    const result = runtime.execute(compiledCode);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Nooby server listening at http://localhost:${port}`);
});

// Watch for changes in .nb files
const watcher = chokidar.watch('./examples/**/*.nb');
watcher.on('change', (filePath) => {
  console.log(`File ${filePath} has been changed`);
  // You can add logic here to trigger a recompilation and update the preview
});