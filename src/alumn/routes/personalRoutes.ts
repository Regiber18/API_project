import { Router } from "express";
import { getPersonalAll, getPersonalId, createPersonal, updatePersonal, deletePersonal, loginPersonal} from "../controllers/personalController"
import { authMiddleware } from "../../shared/middlewares/auth";
const routePersonal: Router = Router();

routePersonal.post('/login', loginPersonal)

routePersonal.get('/', getPersonalAll);
routePersonal.post('/', createPersonal);
routePersonal.get('/:personal_id', authMiddleware, getPersonalId);
routePersonal.put('/:personal_id', updatePersonal)
routePersonal.delete('/:personal_id', deletePersonal)

export default routePersonal; 