import { Router } from 'express';
import {
  createAssignment,
  getMyAssignments,
  getMyCourses,
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

// Course & Assignment Management Routes
router.get('/courses', getMyCourses);
router.post('/assignments', createAssignment);
router.get('/assignments', getMyAssignments);
router.patch('/assignments/:id', updateAssignment);

// Grading Routes (IDOR Protected)
router.get('/assignments/:assignmentId/submissions', getAssignmentSubmissions);
router.patch('/submissions/:submissionId/grade', gradeSubmission);

export default router;
