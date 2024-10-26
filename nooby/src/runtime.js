const stdlib = {
    math: require('./stdlib/math'),
    io: require('./stdlib/io'),
  };
  
  class NoobyRuntime {
    constructor() {
      this.globalScope = { ...stdlib };
    }
  
    execute(compiledCode) {
      const executionContext = { ...this.globalScope };
      
      const executeFunction = new Function(...Object.keys(executionContext), compiledCode);
      
      return executeFunction(...Object.values(executionContext));
    }
  }
  
  module.exports = { NoobyRuntime };