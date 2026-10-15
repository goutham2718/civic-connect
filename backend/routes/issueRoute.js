import express from 'express'
import upload from '../middleware/upload.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { requireDepartmentAccess } from '../middleware/departmentAccess.js';
import {
  createIssue,
  getIssues,
  getIssueById,
  deleteIssue,
  getIssuesByUserId,
  getAdminIssues,
  updateIssueStatus,
  reassignRoadType,
  checkNearbyIssues
} from '../controllers/issueController.js';

const issueRouter = express.Router();

issueRouter.post('/check-nearby', authenticate, checkNearbyIssues)
issueRouter.post('/', authenticate, upload.single('image'), createIssue);
issueRouter.get('/myissues', authenticate, getIssuesByUserId)
issueRouter.get('/admin', authenticate, authorize('dept_admin', 'super_admin'), getAdminIssues)
issueRouter.patch('/:id/status', authenticate, authorize('dept_admin', 'super_admin'), requireDepartmentAccess, updateIssueStatus)
issueRouter.patch('/:id/reassign-road-type', authenticate, authorize('dept_admin', 'super_admin'), requireDepartmentAccess, reassignRoadType)
issueRouter.get('/:id', getIssueById); // public
issueRouter.get('/', getIssues); // public
issueRouter.delete('/', authenticate, deleteIssue);

export default issueRouter;