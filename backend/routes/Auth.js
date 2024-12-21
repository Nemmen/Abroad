import express from 'express';
import {checkUser, login, logout,getAllusers,studentCreate, register, getStudent,addGicForm, viewAllGicForm, addForexForm, viewAllForexForms, getAllBlockedData,  } from '../controllers/Auth.js';
import { uploadFile } from '../controllers/googleDrive.js'; // Import Google Drive upload controller
import { IsUser } from '../middleware/verifyToken.js';

const AuthRoutes = express.Router();

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
AuthRoutes.put('/updateProfile',IsUser, updateProfile);

// Form Handling Routes
AuthRoutes.post('/addGicForm', addGicForm);
AuthRoutes.get('/viewAllGicForm', viewAllGicForm);
AuthRoutes.post('/addForexForm', addForexForm);
AuthRoutes.get('/getAllusers', getAllusers);
AuthRoutes.get('/viewAllForexForms', viewAllForexForms);
AuthRoutes.post('/studentCreate', studentCreate);
AuthRoutes.get('/getStudent', getStudent);

// Blocked Data Routes
AuthRoutes.get('/getAllBlockedData', getAllBlockedData);
// AuthRoutes.post('/createBlockedData', createBlockedData);

// // File Upload to Google Drive
// AuthRoutes.post('/upload',uploadFile); // Limit to 5 files per request

export default AuthRoutes;
