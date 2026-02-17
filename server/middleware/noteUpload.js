const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Use /tmp for Netlify/Serverless environments
        const isNetlify = process.env.NETLIFY === 'true' || process.env.LAMBDA_TASK_ROOT;
        const uploadDir = isNetlify ? '/tmp/notes' : './uploads/notes';

        try {
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
        } catch (err) {
            console.log('Note: Directory creation handled for serverless');
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'note-' + Date.now() + path.extname(file.originalname));
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /pdf|doc|docx|txt|ppt|pptx/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only PDF, DOC, DOCX, TXT, and PPT files are allowed!');
    }
}

// Init upload
const noteUpload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = noteUpload;
