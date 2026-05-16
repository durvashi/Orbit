import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getProjects)
  .post(authorize('admin'), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(authorize('admin'), deleteProject);

router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

export default router;
