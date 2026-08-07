import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@eduassess.com" }
 *               password: { type: string, example: "Password123!" }
 *               role: { type: string, enum: [Admin, Teacher, Student], example: "Student" }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and generate JWT token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@eduassess.com" }
 *               password: { type: string, example: "Password123!" }
 *     responses:
 *       200:
 *         description: Authentication successful with JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

export default router;
