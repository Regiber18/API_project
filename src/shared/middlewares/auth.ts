import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PersonalRepository } from '../../alumn/repositories/PersonalRepository';
import { PersonalPayload } from '../config/types/personalPayload';
import { AuthRequest } from '../config/types/authRequest';

dotenv.config();

const secretKey = process.env.SECRET || "";

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const payload = jwt.verify(token, secretKey) as PersonalPayload;
    const employee = await PersonalRepository.findById(payload.personal_id);

    if (!employee) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.personalData = payload;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
      return; 
    }
    res.status(401).json({ message: 'Unauthorized' });
  }
};
