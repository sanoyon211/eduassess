import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET || 'eduassess_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
