import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Submission } from '../models/Submission';

export const getSubmissions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const list = await Submission.find().populate('studentId', 'name email');
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
