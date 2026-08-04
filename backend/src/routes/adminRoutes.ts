import { Router } from 'express';
import {
  getAllUsers,
  createCourse,
  assignTeacherToCourse,
  enrollStudentsToCourse,
} from '../controllers/adminController';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

// Protect all admin routes with verifyToken and authorizeRoles('Admin')
router.use(verifyToken);
router.use(authorizeRoles(UserRole.ADMIN));

// Endpoints
router.get('/users', getAllUsers);
router.post('/courses', createCourse);
router.patch('/courses/:courseId/assign-teacher', assignTeacherToCourse);
router.post('/courses/:courseId/enroll-students', enrollStudentsToCourse);

export default router;
