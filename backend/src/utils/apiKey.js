const crypto = require("crypto");

// 🔹 Generate random API key
const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

// 🔹 Hash API key
const hashApiKey = (key) => {
  return crypto.createHash("sha256").update(key).digest("hex");
};

module.exports = {
  generateApiKey,
  hashApiKey
};