import { Router } from "express";
import { getAlumnAll , getAlumnId, createAlumn, updateALumn, deleteAlumn,  } from "../controllers/alumnController";
import { authMiddleware } from '../../shared/middlewares/auth';

const alumnRoutes: Router = Router();

alumnRoutes.get('/', getAlumnAll)
alumnRoutes.get('/:alumn_id', authMiddleware, getAlumnId,)
alumnRoutes.post("/", createAlumn)
alumnRoutes.put("/:alumn_id", updateALumn)
alumnRoutes.delete("/:alumn_id", deleteAlumn)

export default alumnRoutes;