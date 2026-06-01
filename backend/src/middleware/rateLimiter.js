const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const redis = require("../config/redis");

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args)
  }),
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => {
    if (req.apiKey?.id) {
      return `apiKey:${req.apiKey.id}`;
    }
    return ipKeyGenerator(req);
  },
  message: {
    success: false,
    message: "Too many requests"
  }
});

module.exports = limiter;
