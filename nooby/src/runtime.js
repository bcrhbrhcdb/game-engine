const stdlib = {
    math: require('./stdlib/math'),
    io: require('./stdlib/io'),
    string: require('./stdlib/string')
  };
  
  class NoobyRuntime {
    constructor() {
      this.globalScope = { ...stdlib };
    }
  
    execute(compiledCode) {
      const executionContext = {
        ...this.globalScope,
        console: console // Allow using console.log for debugging
      };
  
      const executeFunction = new Function(...Object.keys(executionContext), compiledCode);
      return executeFunction(...Object.values(executionContext));
    }
  }
  
  module.exports = { NoobyRuntime };