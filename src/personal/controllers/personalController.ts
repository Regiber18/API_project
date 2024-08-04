import { Response, Request } from "express";
import { PersonalServices } from "../services/personalServices";
import jwt from 'jsonwebtoken';
import { generateScreenshot } from '../services/puppeterService'; // Asegúrate de que el nombre del archivo es correcto
import path from 'path';

const secretKey = process.env.SECRET || "";
import { PersonalPayload } from '../../shared/config/types/personalPayload';
import { AlumnData } from "../models/AlumnData";
import { Personal } from "../models/Personal";

// Obtener todos los registros de personal
export const getPersonalAll = async (_req: Request, res: Response) => {
  try {
    const personal = await PersonalServices.getAllPersonal();
    if (personal) {
      res.status(200).json(personal); // Cambiado a 200 para éxito en obtención de datos
    } else {
      res.status(404).json({ message: 'No se encontraron registros de personal' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un registro de personal por ID
export const getPersonalId = async (req: Request, res: Response) => {
  try {
    const personal = await PersonalServices.getPersonalById(parseInt(req.params.personal_id, 10));
    if (personal) {
      res.status(200).json(personal); // Cambiado a 200 para éxito en obtención de datos
    } else {
      res.status(404).json({ message: 'Registro de personal no encontrado' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo registro de personal
export const createPersonal = async (req: Request, res: Response) => {
  try {
    const newEmployee = await PersonalServices.addPersonal(req.body);
    if (newEmployee) {
      res.status(201).json(newEmployee); // 201 para recurso creado
    } else {
      res.status(400).json({ message: 'Error al crear el registro' }); // Cambiado a 400 para solicitud incorrecta
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const updatePersonal = async (req: Request, res: Response) => {
  try {
    const personalId = parseInt(req.params.personal_id, 10);
    const personalData: Personal = req.body.personalData;
    const alumnos: AlumnData[] = req.body.alumnos || [];
    const asistencia: { alumn_id: number, attended: boolean }[] = req.body.asistencia || [];

    const screenshotUrls = personalData.url;
    if (Array.isArray(screenshotUrls) && screenshotUrls.length > 0) {
      const screenshotUrl = screenshotUrls[0]; 
      const screenshotPath = path.join(__dirname, 'output.png'); 
      await generateScreenshot(screenshotUrl, screenshotPath);
    }
    

    const updatedEmployee = await PersonalServices.modifyPersonal(personalId, personalData, alumnos, asistencia);

    if (updatedEmployee) {
      res.status(200).json(updatedEmployee); 
    } else {
      res.status(404).json({ message: 'Registro no encontrado para actualización' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un registro de personal
export const deletePersonal = async (req: Request, res: Response) => {
  try {
    const deleted = await PersonalServices.deletePersonal(parseInt(req.params.personal_id, 10));
    if (deleted) {
      res.status(200).json({ message: "Eliminado exitosamente" }); // 200 para éxito en eliminación
    } else {
      res.status(404).json({ message: "Registro no encontrado para eliminación" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const loginPersonal = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  try {
    const result = await PersonalServices.login(name, password);
    if (!result) {
      return res.status(401).json({ message: 'Nombre de usuario o contraseña inválidos' }); // 401 para credenciales inválidas
    } else {
      const personal = jwt.verify(result, secretKey) as PersonalPayload;
      res.setHeader("Authorization", result);
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.status(200).json({ message: 'Inicio de sesión exitoso', personal });
    }
  } catch (error: any) {
    console.error('Error en inicio de sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
