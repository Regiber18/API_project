import { Router } from "express";
import {  getRatingId, getAmountRating, getRatingtId, getAllsr,createRating, updateRating, deleteRating  } from "../controllers/ratingController";
import { authMiddleware } from "../../shared/middlewares/auth";
const ratingRoutes: Router = Router();

ratingRoutes.get('/', getAllsr); 
ratingRoutes.get('/:rating_id',authMiddleware, getRatingtId); 
ratingRoutes.get('/getRatingId', getRatingId)
ratingRoutes.get('/getAmount', getAmountRating)
ratingRoutes.get('/getsr', getAllsr)
ratingRoutes.post('/', createRating)
ratingRoutes.put('/:rating_id', updateRating)
ratingRoutes.delete('/:rating_id', deleteRating)

export default ratingRoutes; 