const validate = (schema) =>(req, res, next) =>{
    try{
        schema.parse(req.body);
        next();
    }
    catch(error){
        return res.status(400).json({
            message: error.issues[0].message,
            field: error.issues[0].path[0]
        });
    }
}

module.exports = validate;