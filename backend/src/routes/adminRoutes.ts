import { Router } from 'express';
import {
  getAllUsers,
  getAllCourses,
  createCourse,
  assignTeacherToCourse,
  enrollStudentsToCourse,
} from '../controllers/adminController';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(verifyToken);
router.use(authorizeRoles(UserRole.ADMIN));

router.get('/users', getAllUsers);
router.get('/courses', getAllCourses);
router.post('/courses', createCourse);
router.patch('/courses/:courseId/assign-teacher', assignTeacherToCourse);
router.post('/courses/:courseId/enroll-students', enrollStudentsToCourse);

export default router;
