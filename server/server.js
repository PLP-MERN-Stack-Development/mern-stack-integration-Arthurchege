// server/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db.js'); 
const errorHandler = require('./middleware/errorMiddleware.js'); 

// --- 1. Load Environment Variables ---
dotenv.config();

// --- 2. Connect to Database ---
connectDB();

// --- 3. Initialize Express App ---
const app = express();

// --- 4. Middleware ---
app.use(cors()); 
// Body parsers to handle JSON and standard form data
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

// --- 5. Static Folder for Uploads ---
// Makes the /uploads folder publicly accessible via the /uploads URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

// --- 6. Import Routes ---
const categoryRoutes = require('./routes/categoryRoutes'); 
const postRoutes = require('./routes/postRoutes'); 
const authRoutes = require('./routes/authRoutes');

// --- 7. Route Mounting ---
// Basic test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running and integrated!' });
});

app.use('/api/categories', categoryRoutes); 
app.use('/api/posts', postRoutes); 
app.use('/api/auth', authRoutes); 

// --- 8. Error Handler Middleware ---
// This must be the last middleware mounted!
app.use(errorHandler);

// --- 9. Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});