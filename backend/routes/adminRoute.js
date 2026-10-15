import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  createDeptAdmin,
  getAllAdmins,
  updateAdminDepartments,
  deleteAdmin
} from '../controllers/adminController.js'

const adminRouter = express.Router();

adminRouter.post('/create-dept-admin', authenticate, authorize('super_admin'), createDeptAdmin);
adminRouter.get('/admins', authenticate, authorize('super_admin'), getAllAdmins);
adminRouter.patch('/admins/:id', authenticate, authorize('super_admin'), updateAdminDepartments);
adminRouter.delete('/admins/:id', authenticate, authorize('super_admin'), deleteAdmin);

export default adminRouter;