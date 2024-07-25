import { Response, Request } from "express"
import { RatingService } from "../services/ratingServices"

export const getAllRating = async (_req: Request, res: Response) => {
  try {
    const alumns = await RatingService.getAllRating()

    if(alumns) {
      res.status(201).json(alumns) 
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getRatingId = async (_req: Request, res: Response) => {
  try {
    const alumns = await RatingService.getRatingId()

    if(alumns) {
      res.status(201).json(alumns) 
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getAmountRating = async (_req: Request, res: Response) => {
  try {
    const alumns = await RatingService.getAmountRating()

    if(alumns) {
      res.status(201).json(alumns) 
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getRatingtId = async (req: Request, res: Response) => {
  try {
    const alumns = await RatingService.getRatingtById(parseInt(req.params.ballot_id, 10))

    if(alumns) {
      res.status(201).json(alumns)
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createRating = async (req: Request, res: Response) => {
  try {
    const newEmployee = await RatingService.addRating(req.body);
    if(newEmployee){
      res.status(201).json(newEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateRating = async (req: Request, res: Response) => {
  try {
    const updatedEmployee = await RatingService.modifyRating(parseInt(req.params.ballot_id, 10), req.body);
    if(updatedEmployee){
      res.status(201).json(updatedEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  try {
    const deleted = await RatingService.deleteRating(parseInt(req.params.ballot_id, 10));

    if(deleted) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }

}
