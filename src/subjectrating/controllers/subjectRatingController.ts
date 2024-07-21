import { Response, Request } from "express"
import { subjectRatingService } from "../services/SubjectRatingServices"
import connection from "../../shared/config/database"

export const getSubjectRatingAll = async (_req: Request, res: Response) => {
  try {
    const role = await subjectRatingService.getAllSubjectsRating()

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
    const role = await subjectRatingService.getSubjectRatingId(parseInt(req.params.subject_id, 10))

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
    const Rating = require("../../rating/repositories/RatingRepositorie")

    await new Promise<void>((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) {
          reject(err); 
        } else {
          resolve(); 
        }
      });
    });

    const role = await subjectRatingService.addSubjectRating(req.body);
    

    for(let id_new of req.body.rating) {
      const rating = new Rating({role, ...id_new})
      await rating.createRating(connection); 
    }

   

    await new Promise<void>((resolve, reject) => {
      connection.commit((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(); 
          res.send({message: "se añadio"})
        }
      });
    });

    if (role) {
      res.status(201).json(role);
    } else {
      res.status(404).json({ message: "Algo salió mal" });
    }
  } catch (error: any) {
    await new Promise<void>((resolve) => {
      connection.rollback(() => {
        resolve(); 
      });
    });
    res.status(500).json({ error: error.message });
  }
};

export const  updateSubjectRating = async (req: Request, res: Response) => {
  try {
    const role = await subjectRatingService.modifySubjectRating(parseInt(req.params.subject_id, 10), req.body);

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
    const role = await subjectRatingService.deletSubjectRating(parseInt(req.params.subject_id, 10));

    if(role) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {
    res.status(500)
  }
}

