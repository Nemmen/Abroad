import multer from 'multer';

const storage = multer.memoryStorage(); // Use memory storage to avoid temporary files

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
