const prisma = require("../utils/prisma");
const { hashApiKey } = require("../utils/apiKey");

const apiKeyMiddleware = async (req, res, next) => {

    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).send("API key required");
    }

    const keyHash = hashApiKey(apiKey);

    const service = await prisma.service.findFirst({
        where: {
            endpoint: req.baseUrl + req.path
        }
    })
    if (!service) {
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

    // const serviceId = req.serviceId;
    const serviceId = service.id;
    req.serviceId = serviceId;

    const access = await prisma.serviceAccess.findFirst({
        where: {
            userId: key.userId,
            serviceId,
            approved: true
        },
    });

    if (!access) {
        return res.status(404).send("Access not found");
    }

    req.apiKey = key;
    return next();
}

module.exports = apiKeyMiddleware;