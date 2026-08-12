import { Router } from 'express';
import {
  getEnrolledAssignments,
  submitAssignment,
  getMySubmissions,
  updateSubmission,
} from '../controllers/studentController';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(verifyToken);
router.use(authorizeRoles(UserRole.STUDENT));

router.get('/assignments', getEnrolledAssignments);
router.post('/submissions', submitAssignment);
router.get('/submissions', getMySubmissions);
router.put('/submissions/:id', updateSubmission);

export default router;
