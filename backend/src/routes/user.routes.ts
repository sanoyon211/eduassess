import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { User } from '../models/User';

const router = Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
