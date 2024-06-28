import { Router } from "express";
import { getAlumnAll, getAlumnId, createAlumn, deleteAlumn, updateALumn} from "../controllers/groupController"

const groupRoutes: Router = Router();

groupRoutes.get('/', getAlumnAll);
groupRoutes.get('/:group_id', getAlumnId)
groupRoutes.post('/', createAlumn); 
groupRoutes.put('/:group_id', updateALumn)
groupRoutes.delete('/:group_id', deleteAlumn)

export default groupRoutes;