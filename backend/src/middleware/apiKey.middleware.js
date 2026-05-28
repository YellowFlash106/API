const prisma = require("../utils/prisma");
const { hashApiKey } = require("../utils/apiKey");

module.exports = async (req, res, next) =>{

    const header = req.headers.authorization;

    if(!header) return res.status(401).send("API key required");

    const apiKey = header.split(" ")[1];
    const keyHash = hashApiKey(apiKey);

    const service = await prisma.service.findFirst({
        where:{
            endpoint : req.baseUrl + req.path
        }
    })
    if(!service){
        return res.status(404).send("Service not found");
    }
    const key = await prisma.apiKey.findFirst({
        where: {
            keyHash,
            revoked: false,
        },
    });

    if (!key) {
        return res.status(403).send("Invalid api key");
    }

    const access = await prisma.serviceAccess.findFirst({
        where: {
            userId: key.userId,
            serviceId: service.id,
            approved: true,
        },
    });

    if (!access) {
        return res.status(404).send("Access not found");
    }

    req.apiKey = key;
    req.service = service;
    return next();
}
