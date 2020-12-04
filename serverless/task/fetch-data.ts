const fs = require('fs');
const path = require('path');
const output = path.resolve(__dirname, '../static/qdii.json');
const qdii = require('../services/qdii-v2'); 

qdii.main().then(data=>{
  fs.writeFileSync(output, JSON.stringify(data));
  console.log('fetch done');  
})

