const {z} = require('zod');

const reigsterSchema = z.object({
    email: z.string().email("Invalid email address"),
    password : z.string().min(6, "Password must be at least 6 characters long")
})

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password : z.string().min(1, "Password  required")
    
})

module.exports = {
    reigsterSchema,
    loginSchema
};