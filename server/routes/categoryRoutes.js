// server/routes/categoryRoutes.js

const express = require('express');
const { 
    getCategories, 
    createCategory 
} = require('../controllers/categoryController');

const router = express.Router();

// Base route is already '/api/categories' (will set this in server.js)
router.route('/').get(getCategories).post(createCategory);

module.exports = router;