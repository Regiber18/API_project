import { Router } from "express";
import { getAlumnAll, getAlumnId, createAlumn, updateALumn, deleteAlumn, loginPersonal} from "../controllers/personalController"
import { authMiddleware } from "../../shared/middlewares/auth";
const routePersonal: Router = Router();

routePersonal.post('/login', loginPersonal)

routePersonal.get('/', getAlumnAll);
routePersonal.get('/:personal_id', authMiddleware, getAlumnId);
routePersonal.post('/', createAlumn);
routePersonal.put('/:personal_id', updateALumn)
routePersonal.delete('/:personal_id', deleteAlumn)

export default routePersonal; 