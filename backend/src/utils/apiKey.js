const crypto = require("crypto");

const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const hashApiKey = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

module.exports = {
  generateApiKey,
  hashApiKey
};