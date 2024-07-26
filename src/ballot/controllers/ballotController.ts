import { Response, Request } from "express"
import { BallotService } from "../services/ballotService"

export const getAllBallots = async (_req: Request, res: Response) => {
  try {
    const ballots = await BallotService.getAllBallots()
    

    if(ballots) {
      res.status(201).json(ballots)
    }else {
      res.status(404).json(ballots)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getUrlBallot = async (_req: Request, res: Response) => {
  try {
    const ballots = await BallotService.getUrlBallot();

    if(ballots) {
      res.status(201).json(ballots) 
    }else {
      res.status(404).json(ballots)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}


export const getBallotId = async (req: Request, res: Response) => {
  try {
    const ballots = await BallotService.getBallotById(parseInt(req.params.ballot_id, 10))

    if(ballots) {
      res.status(201).json(ballots)
    }else {
      res.status(404).json(ballots)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createBallot = async (req: Request, res: Response) => {
  try {

    const newBallot = await BallotService.addBallot(req.body);

    if (newBallot) {
      res.status(201).json(newBallot);
    } else {
      res.status(404).json({ message: 'Algo salió mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const  updateBallot = async (req: Request, res: Response) => {
  try {   
    const updatedBallot = await BallotService.modifyBallot(parseInt(req.params.ballot_id, 10), req.body);
    if(updatedBallot){
      res.status(201).json(updatedBallot);
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
