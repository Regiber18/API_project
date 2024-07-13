import { Router } from "express";
import { getAllRating, getRatingtId, createRating, updateRating, deleteRating  } from "../controllers/ratingController";

const ratingRoutes: Router = Router();

ratingRoutes.get('/', getAllRating); 
ratingRoutes.get('/:rating_id', getRatingtId); 
ratingRoutes.post('/', createRating)
ratingRoutes.put('/:rating_id', updateRating)
ratingRoutes.delete('/:rating_id', deleteRating)

export default ratingRoutes; 