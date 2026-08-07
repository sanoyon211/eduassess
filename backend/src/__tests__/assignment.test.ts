import request from 'supertest';
import express from 'express';
import teacherRoutes from '../routes/teacherRoutes';
import { Assignment, AssignmentStatus } from '../models/Assignment';
import { Course } from '../models/Course';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/teacher', teacherRoutes);

jest.mock('../models/Assignment');
jest.mock('../models/Course');

describe('Teacher Assignment Business Logic Unit Tests', () => {
  const mockTeacherId = 'teacher123';
  const mockToken = jwt.sign(
    { userId: mockTeacherId, email: 'teacher@eduassess.com', role: 'Teacher' },
    process.env.JWT_SECRET || 'eduassess_super_secret_jwt_key_2026_safe'
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/teacher/assignments', () => {
    it('should allow teacher to create an assignment with maxMarks', async () => {
      (Course.findById as jest.Mock).mockResolvedValue({
        _id: 'course123',
        assignedTeacherId: mockTeacherId,
      });

      const mockCreatedAssignment = {
        _id: 'assign123',
        title: 'Data Structures Lab',
        description: 'Binary trees lab',
        dueDate: new Date(),
        maxMarks: 100,
        status: AssignmentStatus.PUBLISHED,
      };

      (Assignment.create as jest.Mock).mockResolvedValue(mockCreatedAssignment);
      (Assignment.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockCreatedAssignment),
        }),
      });

      const res = await request(app)
        .post('/api/teacher/assignments')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'Data Structures Lab',
          description: 'Binary trees lab',
          dueDate: new Date().toISOString(),
          courseId: 'course123',
          maxMarks: 100,
          status: 'Published',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.maxMarks).toBe(100);
    });

    it('should reject creation if course is assigned to another teacher (IDOR)', async () => {
      (Course.findById as jest.Mock).mockResolvedValue({
        _id: 'course123',
        assignedTeacherId: 'other_teacher_999',
      });

      const res = await request(app)
        .post('/api/teacher/assignments')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'Unauthorized Assignment',
          description: 'Test',
          dueDate: new Date().toISOString(),
          courseId: 'course123',
          maxMarks: 50,
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/only create assignments for courses assigned to you/i);
    });
  });
});
