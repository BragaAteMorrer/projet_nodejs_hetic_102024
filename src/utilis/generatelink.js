const crypto = require('crypto');

function generateTemporaryLink(fileId) {
  const token = crypto.randomBytes(20).toString('hex');
  const expiration = Date.now() + 3600 * 1000; // 1 heure
  return { token, expiration };
}

module.exports = generateTemporaryLink;
