import request from 'supertest';
import express from 'express';
import studentRoutes from '../routes/studentRoutes';
import { Submission, SubmissionStatus } from '../models/Submission';
import { Assignment, AssignmentStatus } from '../models/Assignment';
import { Course } from '../models/Course';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/student', studentRoutes);

jest.mock('../models/Submission');
jest.mock('../models/Assignment');
jest.mock('../models/Course');

describe('Student Submission Workflow & Business Rules Unit Tests', () => {
  const mockStudentId = 'student123';
  const mockToken = jwt.sign(
    { userId: mockStudentId, email: 'student@eduassess.com', role: 'Student' },
    process.env.JWT_SECRET || 'eduassess_super_secret_jwt_key_2026_safe'
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/student/submissions', () => {
    it('should allow student to submit an answer before deadline', async () => {
      const futureDate = new Date(Date.now() + 86400000); // 1 day in future
      (Assignment.findById as jest.Mock).mockResolvedValue({
        _id: 'assign123',
        status: AssignmentStatus.PUBLISHED,
        dueDate: futureDate,
        courseId: 'course123',
      });

      (Course.findOne as jest.Mock).mockResolvedValue({
        _id: 'course123',
        enrolledStudentIds: [mockStudentId],
      });

      (Submission.findOne as jest.Mock).mockResolvedValue(null);

      const mockSubmission = {
        _id: 'sub123',
        assignmentId: 'assign123',
        studentId: mockStudentId,
        fileUrl: 'https://github.com/student/solution',
        status: SubmissionStatus.PENDING,
      };

      (Submission.create as jest.Mock).mockResolvedValue(mockSubmission);
      (Submission.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockSubmission),
        }),
      });

      const res = await request(app)
        .post('/api/student/submissions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          assignmentId: 'assign123',
          fileUrl: 'https://github.com/student/solution',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.fileUrl).toBe('https://github.com/student/solution');
    });

    it('should reject submission if due date has passed (Deadline Enforcement)', async () => {
      const pastDate = new Date(Date.now() - 86400000); // 1 day in past
      (Assignment.findById as jest.Mock).mockResolvedValue({
        _id: 'assign123',
        status: AssignmentStatus.PUBLISHED,
        dueDate: pastDate,
        courseId: 'course123',
      });

      (Course.findOne as jest.Mock).mockResolvedValue({
        _id: 'course123',
        enrolledStudentIds: [mockStudentId],
      });

      const res = await request(app)
        .post('/api/student/submissions')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          assignmentId: 'assign123',
          fileUrl: 'https://github.com/student/solution',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/due date has passed/i);
    });
  });

  describe('PUT /api/student/submissions/:id (Update before deadline)', () => {
    it('should allow student to update submission before deadline', async () => {
      const futureDate = new Date(Date.now() + 86400000);
      const mockExistingSub = {
        _id: 'sub123',
        assignmentId: 'assign123',
        studentId: mockStudentId,
        fileUrl: 'https://github.com/student/old-solution',
        status: SubmissionStatus.PENDING,
        save: jest.fn().mockResolvedValue(true),
      };

      (Submission.findById as jest.Mock).mockResolvedValue(mockExistingSub);
      (Assignment.findById as jest.Mock).mockResolvedValue({
        _id: 'assign123',
        dueDate: futureDate,
      });

      (Submission.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            ...mockExistingSub,
            fileUrl: 'https://github.com/student/new-updated-solution',
          }),
        }),
      });

      const res = await request(app)
        .put('/api/student/submissions/sub123')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          fileUrl: 'https://github.com/student/new-updated-solution',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
