const fs = require('fs');
const path = require('path');
const output = path.resolve(__dirname, '../static/qdii.json');
const outputDir = path.resolve(__dirname, '../static/');
const qdii = require('../services/qdii-v2'); 

qdii.main().then(([data, resData])=>{
  fs.writeFileSync(output, JSON.stringify(data));
  Object.keys(resData).forEach(code => {
    const p = path.join(outputDir, `${code}-data.json`);
    console.log(p);
    fs.writeFileSync(p, JSON.stringify(resData[code]));
  });
  console.log('fetch done');  
})

