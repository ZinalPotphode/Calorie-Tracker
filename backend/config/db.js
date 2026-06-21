const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongodInstance = null;

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  // Try real MongoDB if URI provided
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB connected (external)');
      return;
    } catch (err) {
      console.warn('External MongoDB connection failed, falling back to in-memory. Error:', err.message || err);
    }
  }

  // Fallback to in-memory MongoDB for dev when no URI or external connection fails
  try {
    console.log('Starting in-memory MongoDB...');
    mongodInstance = await MongoMemoryServer.create({ instance: { dbName: 'calorie-tracker' } });
    const uri = mongodInstance.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB connected (in-memory)');

    const stopHandler = async () => {
      try {
        await mongoose.disconnect();
        if (mongodInstance) await mongodInstance.stop();
      } catch (e) {
        // ignore
      }
      process.exit(0);
    };

    process.on('SIGINT', stopHandler);
    process.on('SIGTERM', stopHandler);
  } catch (err) {
    console.error('Failed to start in-memory MongoDB', err);
    process.exit(1);
  }
};

module.exports = connectDB;
