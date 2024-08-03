import { Router } from "express";
import { getPersonalAll, getPersonalId, createPersonal, updatePersonal, deletePersonal, loginPersonal} from "../controllers/personalController"
import { authMiddleware } from "../../shared/middlewares/auth";
import upload from '../../shared/middlewares/uploadMiddleware';
const routePersonal: Router = Router();

routePersonal.post('/login', loginPersonal)

routePersonal.get('/', getPersonalAll);
routePersonal.post('/', createPersonal);
routePersonal.get('/:personal_id', authMiddleware, getPersonalId);
routePersonal.put('/:personal_id', upload.single('productImage'), updatePersonal)
routePersonal.delete('/:personal_id', deletePersonal)

export default routePersonal; 