import { Response, Request } from "express"
import { groupService } from "../services/groupServices"

export const getAlumnAll = async (_req: Request, res: Response) => {
  try {
    const groups = await groupService.getAllEmployees()

    if(groups) {
      res.status(201).json(groups)
    }else {
      res.status(404).json(groups)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getAlumnId = async (req: Request, res: Response) => {
  try {
    const groups = await groupService.getEmployeeById(parseInt(req.params.alumn_id, 10))

    if(groups) {
      res.status(201).json(groups)
    }else {
      res.status(404).json(groups)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createAlumn = async (req: Request, res: Response) => {
  try {
    const newEmployee = await groupService.addGroup(req.body);
    if(newEmployee){
      res.status(201).json(newEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateALumn = async (req: Request, res: Response) => {
  try {
    const updatedEmployee = await groupService.modifyGroup(parseInt(req.params.alumnId, 10), req.body);
    if(updatedEmployee){
      res.status(201).json(updatedEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAlumn = async (req: Request, res: Response) => {
  try {
    const deleted = await groupService.deleteEmployee(parseInt(req.params.alumn_id, 10));

    if(deleted) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {

  }

}

