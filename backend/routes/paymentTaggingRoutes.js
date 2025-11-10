import express from 'express';
import {
  addPaymentTagging,
  updatePaymentTagging,
  getPaymentTaggingByAgent,
  getAllPaymentTaggings,
  getPaymentTaggingById,
  updatePaymentTaggingStatus,
  updatePaymentTaggingFull,
  deletePaymentTagging,
} from '../controllers/paymentTaggingController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// ==================== AGENT ROUTES ====================
// Add Payment Tagging
router.post('/agent/add', verifyToken, addPaymentTagging);

// Update Payment Tagging
router.put('/agent/update/:id', verifyToken, updatePaymentTagging);

// Get Payment Tagging by Agent
router.get('/agent/get', verifyToken, getPaymentTaggingByAgent);

// ==================== ADMIN ROUTES ====================
// Get All Payment Taggings
router.get('/admin/getall', verifyToken, getAllPaymentTaggings);

// Get Payment Tagging by ID
router.get('/admin/get/:id', verifyToken, getPaymentTaggingById);

// Update Payment Tagging Status (Quick Update)
router.put('/admin/update-status/:id', verifyToken, updatePaymentTaggingStatus);

// Update Payment Tagging (Full Update)
router.put('/admin/update/:id', verifyToken, updatePaymentTaggingFull);

// Delete Payment Tagging
router.delete('/admin/delete/:id', verifyToken, deletePaymentTagging);

export default router;
