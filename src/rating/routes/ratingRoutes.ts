import { Router } from "express";
import { getAllRating, getRatingId, getAmountRating, getRatingtId, createRating, updateRating, deleteRating  } from "../controllers/ratingController";
import { authMiddleware } from "../../shared/middlewares/auth";
const ratingRoutes: Router = Router();

ratingRoutes.get('/', getAllRating); 
ratingRoutes.get('/:rating_id',authMiddleware, getRatingtId); 
ratingRoutes.get('/getRatingId', getRatingId)
ratingRoutes.get('/getAmount', getAmountRating)
ratingRoutes.post('/', createRating)
ratingRoutes.put('/:rating_id', updateRating)
ratingRoutes.delete('/:rating_id', deleteRating)

export default ratingRoutes; 