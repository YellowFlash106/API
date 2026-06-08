const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

let store;

if (process.env.REDIS_URL) {
  try {
    const RedisStore = require("rate-limit-redis").default;
    const redis = require("../config/redis");
    store = new RedisStore({
      sendCommand: (...args) => redis.call(...args)
    });
    console.log("Rate limiter: Using Redis store.");
  } catch (err) {
    console.error("Rate limiter: Redis store error:", err.message);
  }
} else {
  console.log("Rate limiter: REDIS_URL not set. Falling back to MemoryStore.");
}

const limiter = rateLimit({
  ...(store ? { store } : {}),
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
