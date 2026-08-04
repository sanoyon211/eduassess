import { Router } from 'express';
import { getSubmissions } from '../controllers/submission.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateToken, getSubmissions);

export default router;
