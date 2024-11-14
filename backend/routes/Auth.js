import express from 'express';
import multer from 'multer';
import { checkUser, login, logout, register, addGicForm, viewAllGicForm, addForexForm, viewAllForexForms } from '../controllers/Auth.js';
import { IsUser } from '../middleware/verifyToken.js';
// import { uploadFileToCloudinary } from '../controllers/uploadController.js';
const AuthRoutes = express.Router();

// Configure multer for file uploads, specifying the upload directory and file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the directory for uploaded files
  },
  filename: (req, file, cb) => {
    // Store files with a unique name to prevent overwriting
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allow only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for documents'), false);
    }
  },
});

// Apply the upload middleware to the register route to handle `document1` and `document2`
AuthRoutes.post('/register', async (req, res) => {
  try {
    // Call the register controller with the request and response objects
    await register(req, res);
  } catch (error) {
    console.error("Error in registration route:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

AuthRoutes.post('/login', login);
AuthRoutes.post('/logout', logout);
AuthRoutes.get('/checkUser', IsUser, checkUser);
AuthRoutes.post('/addGicForm', addGicForm);
AuthRoutes.get('/viewAllGicForm', viewAllGicForm);
AuthRoutes.post('/addForexForm', addForexForm);
AuthRoutes.get('/viewAllForexForms', viewAllForexForms);
// AuthRoutes.get('/getAllAccount', getAccountRecords);
// AuthRoutes.post('/addAccount', addAccountRecord);



export default AuthRoutes;
