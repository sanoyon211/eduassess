import express, { Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';
import apiRouter from './routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Performance Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger OpenAPI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base Route & Health Check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'EduAssess Backend API Server Running',
    port: PORT,
    documentation: `http://localhost:${PORT}/api-docs`,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'online',
    message: 'EduAssess API Health Check Passed',
    documentation: `http://localhost:${PORT}/api-docs`,
  });
});

// Centralized API Routes
app.use('/api', apiRouter);

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
