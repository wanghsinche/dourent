const fs = require('fs');
const path = require('path');
const output = path.resolve(__dirname, '../static/data.txt');
fs.writeFileSync(output, "test data "+Date().toString()+'\n', {flag: 'a'});
console.log('fetch done');