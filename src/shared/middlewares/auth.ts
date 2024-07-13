import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { PersonalRepository } from '../../personal/repositories/PersonalRepository';
import { PersonalPayload } from '../config/types/personalPayload';
import { AuthRequest } from '../config/types/authRequest'; // Asegúrate de importar AuthRequest con las propiedades extendidas

dotenv.config();

const secretKey = process.env.SECRET || "";

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'No se proporcionó token' });
    return;
  }

  try {
    const payload = jwt.verify(token, secretKey) as PersonalPayload;
    const empleado = await PersonalRepository.findById(payload.personal_id);

    if (!empleado) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }

    req.personalData = payload;


    let direction = '';
    if (empleado.name === "regiber" && empleado.password === "reg") {
      direction = 'management/home'; 
    }


    res.status(200).json({
      message: 'Autenticación exitosa',
      direction: direction,
  
    });
    next()
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expirado' });
      return; 
    }
    res.status(401).json({ message: 'No autorizado' });
  }
};
