import express from 'express';
import {
  Getuser,
  deletUser,
  addUser,
  blockUser,
  getDeletedUser

} from '../controllers/Admin.js';
import { isAdmin } from '../middleware/verifyToken.js';

const AdminRoutes = express.Router();
AdminRoutes.get('/getuser', isAdmin, Getuser);
AdminRoutes.put('/delete/:id', isAdmin, deletUser);
AdminRoutes.get('/getdeleteduser', isAdmin, getDeletedUser);
AdminRoutes.post('/adduser', isAdmin, addUser);
AdminRoutes.put('/block/:id', isAdmin, blockUser);

export default AdminRoutes;
