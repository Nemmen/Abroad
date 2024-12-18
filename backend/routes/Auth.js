import express from 'express';
import multer from 'multer';
import {checkUser, login, logout,getAllusers, register, addGicForm, viewAllGicForm, addForexForm, viewAllForexForms, getAllBlockedData, createBlockedData } from '../controllers/Auth.js';
import { uploadFile } from '../controllers/googleDrive.js'; // Import Google Drive upload controller
import { IsUser } from '../middleware/verifyToken.js';

const AuthRoutes = express.Router();

// Configure Multer for handling PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary folder for storing uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Authentication Routes
AuthRoutes.post('/register', async (req, res) => {
  try {
    await register(req, res);
  } catch (error) {
    console.error('Error in registration route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
AuthRoutes.post('/login', login);
AuthRoutes.post('/logout', logout);
AuthRoutes.get('/checkUser', IsUser, checkUser);

// Form Handling Routes
AuthRoutes.post('/addGicForm', addGicForm);
AuthRoutes.get('/viewAllGicForm', viewAllGicForm);
AuthRoutes.post('/addForexForm', addForexForm);
AuthRoutes.get('/getAllusers', getAllusers);
AuthRoutes.get('/viewAllForexForms', viewAllForexForms);

// Blocked Data Routes
AuthRoutes.get('/getAllBlockedData', getAllBlockedData);
AuthRoutes.post('/createBlockedData', createBlockedData);

// File Upload to Google Drive
AuthRoutes.post('/upload', upload.array('files', 5), uploadFile); // Limit to 5 files per request

export default AuthRoutes;
