const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

mongoose.set('debug', true);

const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from the environment variables
        await mongoose.connect(process.env.MONGODB_URI, {
            connectTimeoutMS: 30000,  // Optional: Time limit for initial connection
            socketTimeoutMS: 30000    // Optional: Time limit for socket inactivity
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        // process.exit(1); // Uncomment if you want to terminate the app after a failed DB connection
    }
};

module.exports = connectDB;
