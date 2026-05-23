const prisma = require('../utils/prisma');

module.exports = async (req, res, next) =>{
    const originalSend = res.send;

    res.send = async function (body) {
        try {
            if(req.apiKey && req.service) {
                await prisma.requestLog.create({
                    data:{
                        apiKeyId: req.apiKey.id,
                        serviceId: req.service.id,
                        status : res.statusCode,
                    }
                });
            }
        } catch (error) {
            console.log('Logging Error', error);
            
        }
        return originalSend.call(this, body);
    }
    next();
}