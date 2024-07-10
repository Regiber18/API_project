import { Response, Request } from "express"
import { subjectService } from "../services/subjectServices"

export const getSubjectAll = async (_req: Request, res: Response) => {
  try {
    const role = await subjectService.getAllSubjects()

    if(role) {
      res.status(201).json(role)
    }else {
      res.status(404).json(role)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getSubjectId = async (req: Request, res: Response) => {
  try {
    const role = await subjectService.getSubjectId(parseInt(req.params.subject_id, 10))

    if(role) {
      res.status(201).json(role)
    }else {
      res.status(404).json(role)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createSubject = async (req: Request, res: Response) => {
  try {
    const role = await subjectService.addSubject(req.body);

    if(role){
      res.status(201).json(role);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateSubject = async (req: Request, res: Response) => {
  try {
    const role = await subjectService.modifySubject(parseInt(req.params.subject_id, 10), req.body);

    if(role){
      res.status(201).json(role);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const role = await subjectService.deletSubject(parseInt(req.params.subject_id, 10));

    if(role) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {
    res.status(500)
  }
}

