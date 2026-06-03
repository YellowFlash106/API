const { ZodError } = require("zod");

const validate = (schema) => (req, res, next) => {
    if (!schema) {
        return next(new Error("Schema is undefined in validation middleware"));
    }
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: error.issues[0]?.message || "Validation error",
                field: error.issues[0]?.path[0]
            });
        }
        next(error);
    }
}

module.exports = validate;