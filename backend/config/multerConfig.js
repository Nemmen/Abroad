import multer from 'multer';
import path from 'path';

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
const uploadDocuments = upload.fields([{ name: 'document1' }, { name: 'document2' }]);

export { uploadDocuments };
