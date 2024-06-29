import { Router } from "express";
import { getClassAll, getClassId, createClass, deleteClass, updateClass} from "../controllers/classController"

const classRoutes: Router = Router();

classRoutes.get('/', getClassAll);
classRoutes.get('/:group_id', getClassId)
classRoutes.post('/', createClass); 
classRoutes.put('/:group_id', updateClass)
classRoutes.delete('/:group_id', deleteClass)

export default classRoutes;