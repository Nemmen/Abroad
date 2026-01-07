import express from 'express';
import {
  // Agent Controllers
  addStudentFunding,
  updateStudentFunding,
  getStudentFundingByAgent,
  // Admin Controllers
  getAllStudentFundings,
  getStudentFundingById,
  updateStudentFundingStatus,
  updateStudentFundingAdmin,
  deleteStudentFunding,
} from '../controllers/studentFundingController.js';
import { isAdmin, IsUser } from '../middleware/verifyToken.js';

const router = express.Router();

// Middleware to log all requests to student funding routes
router.use((req, res, next) => {
  console.log(`Student Funding Route: ${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString(),
  });
  next();
});

// Test route to verify student funding routes are working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Student funding routes are working',
    timestamp: new Date().toISOString()
  });
});

/**
 * AGENT ROUTES
 */

// Agent adds a new student funding request
router.post('/agent/add', IsUser, addStudentFunding);

// Agent updates their student funding request
router.put('/agent/update/:id', IsUser, updateStudentFunding);

// Agent gets their student funding requests (with filters)
router.get('/agent/get', IsUser, getStudentFundingByAgent);

/**
 * ADMIN ROUTES
 */

// Admin gets all student funding requests with filters and analytics
router.get('/admin/getall', isAdmin, getAllStudentFundings);

// Admin gets a single student funding request by ID
router.get('/admin/get/:id', isAdmin, getStudentFundingById);

// Admin updates status and remarks of a student funding request
router.put('/admin/update-status/:id', isAdmin, updateStudentFundingStatus);

// Admin updates full student funding record
router.put('/admin/update/:id', isAdmin, updateStudentFundingAdmin);

// Admin deletes a student funding request
router.delete('/admin/delete/:id', isAdmin, deleteStudentFunding);

export default router;
