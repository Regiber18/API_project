import { Router } from "express";
import { getClassAll, getClassId, createClass, deleteClass, updateClass} from "../controllers/classController"

const classRoutes: Router = Router();

classRoutes.get('/', getClassAll);
classRoutes.get('/:class_id', getClassId)
classRoutes.post('/', createClass); 
classRoutes.put('/:class_id', updateClass)
classRoutes.delete('/:class_id', deleteClass)

export default classRoutes;