import express from 'express';
import {checkUser, login, logout,getAllusers,studentCreate, register, getStudent,addGicForm, viewAllGicForm, addForexForm, viewAllForexForms, getAllBlockedData, updateGicForm, updateForexForm, forgotPassword, resetPassword  } from '../controllers/Auth.js';
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
AuthRoutes.post('/auth/forgot-password', forgotPassword);
AuthRoutes.post('/auth/reset-password', resetPassword);



// Form Handling Routes
AuthRoutes.post('/addGicForm', addGicForm);
AuthRoutes.get('/viewAllGicForm', viewAllGicForm);
AuthRoutes.put('/updateGicForm/:id', updateGicForm);
AuthRoutes.post('/addForexForm', addForexForm);
AuthRoutes.get('/getAllusers', getAllusers);
AuthRoutes.get('/viewAllForexForms', viewAllForexForms);
AuthRoutes.post('/studentCreate', studentCreate);
AuthRoutes.get('/getStudent', getStudent);
AuthRoutes.put('/updateForexForm/:id', updateForexForm);

// Blocked Data Routes
AuthRoutes.get('/getAllBlockedData', getAllBlockedData);
// AuthRoutes.post('/createBlockedData', createBlockedData);

// // File Upload to Google Drive
// AuthRoutes.post('/upload',uploadFile); // Limit to 5 files per request


export default AuthRoutes;
