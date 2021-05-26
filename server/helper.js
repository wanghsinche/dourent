module.exports.buildBody = (data, code, error)=>({
    code: code || 200,
    error: String(error),
    data
});

