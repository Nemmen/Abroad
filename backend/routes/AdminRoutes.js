import express from 'express';
import {
  Getuser,
  deletUser,
  addUser,
  blockUser,
} from '../controllers/Admin.js';
import { isAdmin } from '../middleware/verifyToken.js';

const AdminRoutes = express.Router();
AdminRoutes.get('/getuser', isAdmin, Getuser);
AdminRoutes.delete('/delet/:id', isAdmin, deletUser);
AdminRoutes.post('/adduser', isAdmin, addUser);
AdminRoutes.put('/block/:id', isAdmin, blockUser);

export default AdminRoutes;
