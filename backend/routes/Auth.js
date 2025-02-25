import express from 'express';
<<<<<<< HEAD
import {checkUser, login, logout,getAllusers,studentCreate, register, getStudent,addGicForm, viewAllGicForm, addForexForm, viewAllForexForms, getAllBlockedData, updateGicForm, updateForexForm, forgotPassword, resetPassword  } from '../controllers/Auth.js';
=======
import {checkUser, verifyAndResetPassword, getAgentCommission, login, logout,getAllusers,studentCreate, register, getStudent,addGicForm, viewAllGicForm, addForexForm, viewAllForexForms, getAllBlockedData, updateGicForm, updateForexForm,getAgentStats, sendOtp  } from '../controllers/Auth.js';
>>>>>>> 1ed4caf76eeb4bdcce35045910b516607e2999bb
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
<<<<<<< HEAD
AuthRoutes.post('/auth/forgot-password', forgotPassword);
AuthRoutes.post('/auth/reset-password', resetPassword);


=======
// AuthRoutes.put('/updateProfile',IsUser, updateProfile);
>>>>>>> 1ed4caf76eeb4bdcce35045910b516607e2999bb

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
AuthRoutes.post('/send-otp', sendOtp);
AuthRoutes.post('/reset-password', verifyAndResetPassword);
AuthRoutes.get("/getAgentCommission", IsUser, getAgentCommission);

AuthRoutes.get("/agent/stats", IsUser, getAgentStats);




// Blocked Data Routes
AuthRoutes.get('/getAllBlockedData', getAllBlockedData);
// AuthRoutes.post('/createBlockedData', createBlockedData);

// // File Upload to Google Drive
// AuthRoutes.post('/upload',uploadFile); // Limit to 5 files per request


export default AuthRoutes;
