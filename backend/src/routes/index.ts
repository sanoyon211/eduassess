import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import teacherRoutes from './teacher.routes';
import studentRoutes from './student.routes';
import assignmentRoutes from './assignment.routes';
import submissionRoutes from './submission.routes';
import userRoutes from './user.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/teacher', teacherRoutes);
apiRouter.use('/student', studentRoutes);
apiRouter.use('/assignments', assignmentRoutes);
apiRouter.use('/submissions', submissionRoutes);
apiRouter.use('/users', userRoutes);

export default apiRouter;
