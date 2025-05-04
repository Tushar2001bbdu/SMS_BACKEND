require('dotenv').config()
const crypto = require('crypto');

const SECRET_KEY = crypto.createHash('sha256').update(process.env.SECRET_KEY).digest(); 
const ALGORITHM = 'aes-256-cbc';

// Encrypt function
const encryptMessage = (message) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), iv);
  let encrypted = cipher.update(message, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; 
};

// Decrypt function
const decryptMessage = (encryptedMessage) => {
  const [iv, encrypted] = encryptedMessage.split(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'hex'), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

module.exports={encryptMessage,decryptMessage}