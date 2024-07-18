import { Response, Request } from "express"
import { personalServices } from "../services/personalServices"
import jwt from 'jsonwebtoken';


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

export const  updatePersonal = async (req: Request, res: Response) => {
  try {
    const updatedEmployee = await personalServices.modifyPersonal(parseInt(req.params.personal_id, 10), req.body);
    if(updatedEmployee){
      res.status(201).json(updatedEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
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
        }

        const { token } = result;
        
        const secretKey = process.env.SECRET || "";

        const decodedToken = jwt.verify(token, secretKey) as { [key: string]: any };

        const { name: userName, lastName, role, personal_id } = decodedToken;

        res.cookie('role', token, result.cookieOptions); 
        res.status(200).json({ name: userName, lastName, role, id: personal_id });

    } catch (error: any) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
