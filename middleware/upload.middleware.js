const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
        return cb(new Error('Invalid file extension'), false);
    }

    if (!allowedMimes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type'), false);
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (parseInt(req.headers['content-length']) > maxSize) {
        return cb(new Error('File size too large'), false);
    }

    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only allow 1 file per request
    },
    fileFilter: fileFilter
});

module.exports = upload;