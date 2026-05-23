const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

module.exports = async (req, res, next) =>{

    const header = req.headers.authorization;

    if(!header) return res.status(401).send("API key required");

    const apiKey = header.split(" ")[1];

    const service = await prisma.service.findFirst({
        where:{
            endpoint : req.baseUrl + req.path
        }
    })
    if(!service){
        return res.status(404).send("Service not found");
    }
    const keys = await prisma.apiKey.findMany({
        where : {revoked : false}
    });

    for(let key of keys){

        const access = await prisma.serviceAccess.findFirst({
            where:{
                userId: key.userId,
                serviceId: service.id,
                approved: true
            }
        })
        if(!access){
            return res.status(404).send("Access not found");
        }

        const match = await bcrypt.compare(apiKey, key.key);

        if(match){
            req.apiKey = key;
            req.service = service;
            return next();
        }
    }
    return res.status(403).send("Invalid api key");
}
