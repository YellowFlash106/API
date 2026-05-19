const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { ipKeyGenerator } = require('express-rate-limit');

const redisClient = require('../utils/redis');


const limiter = rateLimit({
    windowMs : 60 *1000, // 1 minute
    max : 5,
    message:{
        message : "Too many requests from this API key, please try again after a minute"
    },
    
    standardHeaders : true,
    legacyHeaders : false,

    keyGenerator : (req) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return ipKeyGenerator(req);
        }
        return authHeader.split(" ")[1];
    }
})

module.exports = limiter;
