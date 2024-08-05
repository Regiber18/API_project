import { Router } from "express";
import { getPersonalAll, getPersonalId, createPersonal, updatePersonal, deletePersonal, loginPersonal} from "../controllers/personalController"
import upload from "../../shared/middlewares/uploadMiddleware";
const routePersonal: Router = Router();

routePersonal.post('/login', loginPersonal)
routePersonal.get('/', getPersonalAll);
routePersonal.post('/', createPersonal);
routePersonal.get('/:personal_id', getPersonalId);
routePersonal.put('/:personal_id',  upload.single("pdfs"),updatePersonal)
routePersonal.delete('/:personal_id', deletePersonal)

export default routePersonal; 