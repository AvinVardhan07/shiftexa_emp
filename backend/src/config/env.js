const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/shiftexa',
  JWT_SECRET: process.env.JWT_SECRET || 'shiftexa_secret_key_default',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  VOICE_PROVIDER: process.env.VOICE_PROVIDER || 'Retell',
  CALL_RATE_PER_MIN: 3.50 // ₹3.5 per minute standard rate for Meera Real Estate AI
};
