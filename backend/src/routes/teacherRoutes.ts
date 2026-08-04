import { Router } from 'express';
import {
  createAssignment,
  getMyAssignments,
  updateAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
} from '../controllers/teacherController';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

// Protect all routes with verifyToken and authorizeRoles('Teacher')
router.use(verifyToken);
router.use(authorizeRoles(UserRole.TEACHER));

// Assignment Management Routes
router.post('/assignments', createAssignment);
router.get('/assignments', getMyAssignments);
router.patch('/assignments/:id', updateAssignment);

// Grading Routes (IDOR Protected)
router.get('/assignments/:assignmentId/submissions', getAssignmentSubmissions);
router.patch('/submissions/:submissionId/grade', gradeSubmission);

export default router;
