const crypto = require('crypto');

module.exports = function generateApiKey() {
    return "sk_" + crypto.randomBytes(24).toString('hex');
}