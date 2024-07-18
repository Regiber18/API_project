import { Response, Request } from "express"
import { subjectService } from "../services/SubjectRatingServices"

export const getSubjectRatingAll = async (_req: Request, res: Response) => {
  try {
    const role = await subjectService.getAllSubjectsRating()

    if(role) {
      res.status(201).json(role)
    }else {
      res.status(404).json(role)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getSubjectRatingId = async (req: Request, res: Response) => {
  try {
    const role = await subjectService.getSubjectRatingId(parseInt(req.params.subject_id, 10))

    if(role) {
      res.status(201).json(role)
    }else {
      res.status(404).json(role)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createSubjectRating = async (req: Request, res: Response) => {
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

export const  updateSubjectRating = async (req: Request, res: Response) => {
  try {
    const role = await subjectService.modifySubjectRating(parseInt(req.params.subject_id, 10), req.body);

    if(role){
      res.status(201).json(role);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSubjectRating = async (req: Request, res: Response) => {
  try {
    const role = await subjectService.deletSubjectRating(parseInt(req.params.subject_id, 10));

    if(role) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {
    res.status(500)
  }
}

