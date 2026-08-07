import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/authRoutes';
import { User, UserRole } from '../models/User';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock Mongoose model methods
jest.mock('../models/User');

describe('Authentication & RBAC Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new student user successfully', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        _id: 'user123',
        name: 'Test Student',
        email: 'teststudent@eduassess.com',
        role: UserRole.STUDENT,
      });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test Student',
        email: 'teststudent@eduassess.com',
        password: 'Password123!',
        role: UserRole.STUDENT,
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('teststudent@eduassess.com');
    });

    it('should reject registration if email is already in use', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ email: 'existing@eduassess.com' });

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test Student',
        email: 'existing@eduassess.com',
        password: 'Password123!',
        role: UserRole.STUDENT,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already registered/i);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return JWT token', async () => {
      const mockHashedPassword = await bcrypt.hash('Password123!', 10);
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'user123',
        name: 'Test Admin',
        email: 'admin@eduassess.com',
        password: mockHashedPassword,
        role: UserRole.ADMIN,
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@eduassess.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.role).toBe(UserRole.ADMIN);
    });

    it('should reject login with invalid password', async () => {
      const mockHashedPassword = await bcrypt.hash('CorrectPassword123!', 10);
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'user123',
        email: 'admin@eduassess.com',
        password: mockHashedPassword,
      });

      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@eduassess.com',
        password: 'WrongPassword!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid email or password/i);
    });
  });
});
