const crypto = require('crypto');

// A basic utility for encrypting sensitive data
// This satisfies the requirement for "data encryption" options
const encryptData = (text) => {
  const algorithm = 'aes-256-cbc';
  // In a production app, the key and IV should be stored securely in your .env file
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return { 
      iv: iv.toString('hex'), 
      encryptedData: encrypted.toString('hex'),
      key: key.toString('hex') // Keep the key safe!
  };
};

module.exports = { encryptData };