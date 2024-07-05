import { Response, Request } from "express"
import { groupService } from "../services/classServices"

export const getClassAll = async (_req: Request, res: Response) => {
  try {
    const groups = await groupService.getAllClass()

    if(groups) {
      res.status(201).json(groups)
    }else {
      res.status(404).json(groups)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getClassId = async (req: Request, res: Response) => {
  try {
    const groups = await groupService.getClassId(parseInt(req.params.class_id, 10))

    if(groups) {
      res.status(201).json(groups)
    }else {
      res.status(404).json(groups)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createClass = async (req: Request, res: Response) => {
  try {
    const newEmployee = await groupService.addClass(req.body);
    if(newEmployee){
      res.status(201).json(newEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateClass = async (req: Request, res: Response) => {
  try {
    const updatedEmployee = await groupService.modifyClass(parseInt(req.params.class_id, 10), req.body);
    if(updatedEmployee){
      res.status(201).json(updatedEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const deleted = await groupService.deleteClass(parseInt(req.params.class_id, 10));

    if(deleted) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {

  }

}

