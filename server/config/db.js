// server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Use the connection string from the .env file
        // The second argument { ... } is often omitted in modern Mongoose
        // but included here for compatibility.
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If the connection fails, log the error and stop the server process
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;