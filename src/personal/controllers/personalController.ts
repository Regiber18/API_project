import { Response, Request } from "express"
import { personalServices } from "../services/personalServices"
import jwt from 'jsonwebtoken';
const secretKey = process.env.SECRET || "";
import { PersonalPayload } from '../../shared/config/types/personalPayload';
import { AlumnData } from "../models/AlumnData";


export const getPersonalAll = async (_req: Request, res: Response) => {
  try {
    const personal = await personalServices.getAllPersonal()

    if(personal) {
      res.status(201).json(personal)
    }else {
      res.status(404).json(personal)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getPersonalId = async (req: Request, res: Response) => {
  try {
    const personals = await personalServices.getPersonalById(parseInt(req.params.personal_id, 10))

    if(personals) {
      res.status(201).json(personals)
    }else {
      res.status(404).json(personals)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createPersonal = async (req: Request, res: Response) => {
  try {
    const newEmployee = await personalServices.addPersonal(req.body);
    if(newEmployee){
      res.status(201).json(newEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const updatePersonal = async (req: Request, res: Response) => {
  try {
    const personalId = parseInt(req.params.personal_id, 10);
    const personalData = req.body.personalData;
    const alumnos: AlumnData[] = req.body.alumnos || [];
    const updatedEmployee = await personalServices.modifyPersonal(personalId, personalData, alumnos);
    
    if (updatedEmployee) {
      res.status(200).json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Algo salió mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePersonal = async (req: Request, res: Response) => {
  try {
    const deleted = await personalServices.deletePersonal(parseInt(req.params.personal_id, 10));

    if(deleted) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {
    res.status(500)
  }
}

export const loginPersonal = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    try {
        const result = await personalServices.login(name, password);  

        if (!result) {
            return res.status(401).json({ message: 'Nombre de usuario o contraseña inválidos' });
        }else {
          const personal = jwt.verify(result, secretKey) as PersonalPayload;
          res.setHeader("Authorization", result);
          res.setHeader("Access-Control-Expose-Headers","Authorization");
          res.status(200).json({ message: 'Inicio de sesión exitoso', personal});
        }
        
    } catch (error: any) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
