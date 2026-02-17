const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('DEBUG: Checking MONGODB_URI...');

    if (!uri) {
      console.error('FATAL: MONGODB_URI environment variable is NOT defined!');
      process.exit(1);
    }

    console.log('DEBUG: MONGODB_URI is defined.');
    console.log('DEBUG: Length:', uri.length);
    // Log first 15 chars to check protocol (e.g. "mongodb+srv://")
    console.log('DEBUG: Starts with:', uri.substring(0, 15) + '...');

    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
