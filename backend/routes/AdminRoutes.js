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
  getUserById,
  getCurrentMonthForexData,
  getYearlyForexData,
  getCurrentMonthGICs,
  getYearlyGICData,
  getForexAndGicData


} from '../controllers/Admin.js';
import { getCurrentUser } from '../controllers/Auth.js';
import { isAdmin } from '../middleware/verifyToken.js';

const AdminRoutes = express.Router();
AdminRoutes.get('/getuser', isAdmin, Getuser);
AdminRoutes.get('/getcurrentuser', isAdmin, getCurrentUser);
AdminRoutes.put('/delete/:id', isAdmin, deletUser);
AdminRoutes.get('/getdeleteduser',isAdmin, getDeletedUser);
AdminRoutes.post('/adduser', isAdmin, addUser);
AdminRoutes.put('/block/:id', blockUser);
AdminRoutes.get('/getblockuser', isAdmin, getBlockUser);
AdminRoutes.put('/unblock/:id', isAdmin, unblockUser);
AdminRoutes.put('/approve/:id',  approveUser);
AdminRoutes.put('/reject/:id', isAdmin, rejectUser);
AdminRoutes.get('/getuser/:id', isAdmin, getUserById);
AdminRoutes.get('/getCurrentMonthForex', getCurrentMonthForexData);
AdminRoutes.get('/getYearlyForexData', getYearlyForexData);
AdminRoutes.get('/getCurrentMonthGICs', getCurrentMonthGICs);
AdminRoutes.get('/getYearlyGICData', getYearlyGICData);
AdminRoutes.get('/getForexAndGicData', getForexAndGicData);



export default AdminRoutes;
