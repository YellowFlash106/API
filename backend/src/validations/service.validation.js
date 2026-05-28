const { z } = require('zod');

const createServiceSchema = z.object({
    name : z.string().min(2, "name required"),
    description : z.string().min(5, "description required"),
    endpoint : z.string().url("Invalid endpoint URL")
})

module.exports = {
    createServiceSchema
}
