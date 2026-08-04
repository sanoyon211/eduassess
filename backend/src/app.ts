import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import teacherRoutes from './routes/teacherRoutes';
import assignmentRoutes from './routes/assignment.routes';
import submissionRoutes from './routes/submission.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route & Health Check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'EduAssess Backend API Server Running',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'online',
    message: 'EduAssess API Health Check Passed',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);

// Additional Module Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/users', userRoutes);

// Handle Unhandled Routes (404)
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(errorHandler);

// Connect Database and Start Express Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[EduAssess Backend] Server listening on http://localhost:${PORT}`);
  });
};

startServer();

export default app;
