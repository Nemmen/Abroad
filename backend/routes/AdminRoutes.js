import express from 'express';
import {
  Getuser,
  deletUser,
  addUser,
  blockUser,
  getDeletedUser,
  getBlockUser,
  unblockUser,
  approveUser,
  rejectUser,


} from '../controllers/Admin.js';
import { isAdmin } from '../middleware/verifyToken.js';

const AdminRoutes = express.Router();
AdminRoutes.get('/getuser', isAdmin, Getuser);
AdminRoutes.put('/delete/:id', isAdmin, deletUser);
AdminRoutes.get('/getdeleteduser',isAdmin, getDeletedUser);
AdminRoutes.post('/adduser', isAdmin, addUser);
AdminRoutes.put('/block/:id', blockUser);
AdminRoutes.get('/getblockuser', isAdmin, getBlockUser);
AdminRoutes.put('/unblock/:id', isAdmin, unblockUser);
AdminRoutes.put('/approve/:id', isAdmin, approveUser);
AdminRoutes.put('/reject/:id', isAdmin, rejectUser);


export default AdminRoutes;
