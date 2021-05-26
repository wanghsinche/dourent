const path = require('path');
const fs = require('fs');
const jsonObj = require('./db.json');
const { json } = require('express');
class Database {
    readDB(){
        return jsonObj;
    }
    saveDB(){
        fs.writeFileSync(path.resolve(__dirname, './db.json'), JSON.stringify(json));
    }
}

exports.db = new Database();