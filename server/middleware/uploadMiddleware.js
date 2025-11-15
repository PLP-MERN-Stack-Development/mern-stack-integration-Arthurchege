// server/middleware/uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// --- 1. Set Storage Engine ---
const storage = multer.diskStorage({
    destination: './uploads/', // Files will be saved in the 'uploads' folder
    filename: function(req, file, cb){
        // Create a unique file name: fieldname-timestamp.ext
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// --- 2. Initialize Upload ---
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('featuredImage'); // 'featuredImage' must match the form input name

// --- 3. Check File Type ---
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images only!');
    }
}

// --- 4. Export the upload handler ---
module.exports = { upload };