import { Router } from "express";
import { getAllBallots, getBallotId, createBallot, updateBallot, deleteBallot  } from "../controllers/ballotController";
import { authMiddleware } from "../../shared/middlewares/auth";
const ballotsRoute: Router = Router();

ballotsRoute.get('/', getAllBallots); 
ballotsRoute.get('/:ballot_id',authMiddleware, getBallotId); 
ballotsRoute.post('/', createBallot)
ballotsRoute.put('/:ballot_id', updateBallot)
ballotsRoute.delete('/:ballot_id', deleteBallot)

export default ballotsRoute; 