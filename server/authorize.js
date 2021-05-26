const {buildBody} = require('./helper');
const {db:dbInstance} = require('./dbhelper');
const TOKENNAME = 'x-token';
module.exports.TOKENNAME = TOKENNAME;
module.exports.authorize = (requireList)=>function (req, res, next) {
    const token = req.get(TOKENNAME) || req.cookies[TOKENNAME];
    if (!(requireList.some(el=>req.path.startsWith(el))) || verify(token)) {
        next();
        return;
    } 
    res.json(buildBody(null, 403, Error('no authority')));
    
}
  
function verify(tk){
    return tk === 'ok';
    // const [user, code] = tk.split(':');
    // const db = dbInstance.readDB();
    // if (code in db.bindEmail && db.bindEmail[code].includes(user)){
    //     return true;
    // }
    // return false;
}

function bindUserCode(user, code) {
    const db = dbInstance.readDB();
    if (code in db.bindEmail && db.bindEmail[code].length < 10) {
        db.bindEmail[code].push(user);
        dbInstance.saveDB();
        return true;
    }
    return false;
}
