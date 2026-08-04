import { Router } from 'express';
import { getAssignments } from '../controllers/assignment.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getAssignments);

export default router;
