import { Response, Request } from "express"
import { BallotService } from "../services/ballotService"

export const getAllBallots = async (_req: Request, res: Response) => {
  try {
    const alumns = await BallotService.getAllBallots()

    if(alumns) {
      res.status(201).json(alumns) 
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getBallotId = async (req: Request, res: Response) => {
  try {
    const alumns = await BallotService.getBallotById(parseInt(req.params.ballot_id, 10))

    if(alumns) {
      res.status(201).json(alumns)
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createBallot = async (req: Request, res: Response) => {
  try {
    const newEmployee = await BallotService.addBallot(req.body);
    if(newEmployee){
      res.status(201).json(newEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateBallot = async (req: Request, res: Response) => {
  try {
    const updatedEmployee = await BallotService.modifyBallot(parseInt(req.params.ballot_id, 10), req.body);
    if(updatedEmployee){
      res.status(201).json(updatedEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBallot = async (req: Request, res: Response) => {
  try {
    const deleted = await BallotService.deleteBallot(parseInt(req.params.ballot_id, 10));

    if(deleted) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }

}
