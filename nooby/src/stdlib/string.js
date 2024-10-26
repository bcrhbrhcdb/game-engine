module.exports = {
    length: (str) => str.length,
    toUpperCase: (str) => str.toUpperCase(),
    toLowerCase: (str) => str.toLowerCase(),
    substring: (str, start, end) => str.substring(start, end),
    replace: (str, search, replace) => str.replace(search, replace),
    split: (str, separator) => str.split(separator),
    trim: (str) => str.trim(),
    startsWith: (str, searchString) => str.startsWith(searchString),
    endsWith: (str, searchString) => str.endsWith(searchString)
  };