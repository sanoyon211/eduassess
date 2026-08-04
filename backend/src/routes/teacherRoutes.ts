import { Router } from 'express';
import {
  createAssignment,
  getMyAssignments,
  updateAssignment,
} from '../controllers/teacherController';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

// Protect all routes with verifyToken and authorizeRoles('Teacher')
router.use(verifyToken);
router.use(authorizeRoles(UserRole.TEACHER));

// Endpoints
router.post('/assignments', createAssignment);
router.get('/assignments', getMyAssignments);
router.patch('/assignments/:id', updateAssignment);

export default router;
