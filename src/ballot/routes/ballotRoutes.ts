import { Router } from "express";
import { getAllBallots, getUrlBallot, getBallotId, createBallot, updateBallot, deleteBallot  } from "../controllers/ballotController";
import { authMiddleware } from "../../shared/middlewares/auth";
import upload from "../../shared/middlewares/uploadMiddleware";
const ballotsRoute: Router = Router();

ballotsRoute.get('/', getAllBallots); 
ballotsRoute.get('/getUrl', getUrlBallot)
ballotsRoute.get('/:ballot_id',authMiddleware, getBallotId); 
ballotsRoute.post('/', upload.single('pdf'), createBallot)
ballotsRoute.put('/:ballot_id', updateBallot)
ballotsRoute.delete('/:ballot_id', deleteBallot)

export default ballotsRoute; 