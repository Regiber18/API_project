import { Router } from "express";
import { getAllBallots, getAlumnId, createAlumn, updateALumn, deleteAlumn  } from "../controllers/ballotController";

const ballotsRoute: Router = Router();

ballotsRoute.get('/', getAllBallots); 
ballotsRoute.get('/:ballot_id', getAlumnId); 
ballotsRoute.post('/', createAlumn)
ballotsRoute.put('/:ballot_id', updateALumn)
ballotsRoute.delete('/:ballot_id', deleteAlumn)

export default ballotsRoute; 