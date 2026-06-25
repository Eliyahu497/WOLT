const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wolt';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
    } catch (err) {
        console.error('MongoDB connection error on initial connection:', err);
    }
};

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
});

module.exports = { connectDB };
