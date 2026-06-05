const prisma = require("../utils/prisma");

const loggerMiddleware = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      if (!req.apiKey || !req.serviceId) return;

      const responseTime = Date.now() - start;

      // Log to ApiLog (for raw response logs)
      await prisma.apiLog.create({
        data: {
          apiKeyId: req.apiKey.id,
          serviceId: req.serviceId,
          statusCode: res.statusCode,
          responseTime
        }
      });

      // Log to RequestLog (which is used by all dashboard analytics and charts)
      await prisma.requestLog.create({
        data: {
          apiKeyId: req.apiKey.id,
          serviceId: req.serviceId,
          status: res.statusCode
        }
      });
    } catch (err) {
      console.error("Logging failed:", err.message);
    }
  });

  next();
};

module.exports = loggerMiddleware;