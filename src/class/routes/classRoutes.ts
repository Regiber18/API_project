import { Router } from "express";
import { getClassAll, getClassInformation, getClassId, createClass, deleteClass, updateClass} from "../controllers/classController"
import { authMiddleware } from "../../shared/middlewares/auth";
const classRoutes: Router = Router();

classRoutes.get('/', getClassAll);
classRoutes.get('getClass', getClassInformation)
classRoutes.get('/:class_id',authMiddleware, getClassId)
classRoutes.post('/',createClass); 
classRoutes.put('/:class_id', updateClass)
classRoutes.delete('/:class_id', deleteClass)

export default classRoutes;