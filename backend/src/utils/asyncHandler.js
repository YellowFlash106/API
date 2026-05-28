const asynHandler = (fn) => (err, req, res, next) =>{
    Promise.resolve(fn(req, res, next)).catch(next);
}
module.exports = asynHandler;