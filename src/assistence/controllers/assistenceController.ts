import { Response, Request } from "express"
import { assistenceService } from "../services/assistenceServices"

export const getAssistenceAll = async (_req: Request, res: Response) => {
  try {
    const assistence = await assistenceService.getAllAssistence()

    if(assistence) {
      res.status(201).json(assistence)
    }else {
      res.status(404).json(assistence)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getAssistenceId = async (req: Request, res: Response) => {
  try {
    const assistence = await assistenceService.getAssistenceId(parseInt(req.params.assistence_id, 10))

    if(assistence) {
      res.status(201).json(assistence)
    }else {
      res.status(404).json(assistence)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createAssistence = async (req: Request, res: Response) => {
  try {
    const newAssistence = await assistenceService.addAssistence(req.body);
    if(newAssistence){
      res.status(201).json(newAssistence);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateAssistence = async (req: Request, res: Response) => {
  try {
    const updatedAssistence = await assistenceService.modifyAssistence(parseInt(req.params.assistence_id, 10), req.body);

    if(updatedAssistence){
      res.status(201).json(updatedAssistence);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAssistence = async (req: Request, res: Response) => {
  try {
    const deleted = await assistenceService.deletAssistence(parseInt(req.params.assistence_id, 10));

    if(deleted) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {

  }

}