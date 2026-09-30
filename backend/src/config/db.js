const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    // Attempt standard MongoDB connection
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Local MongoDB connection failed (${err.message}). Initializing MongoDB Memory Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] In-Memory MongoDB Connected at: ${mongoUri}`);
    } catch (memErr) {
      console.error(`[Database] Fatal: Failed to start In-Memory MongoDB:`, memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
