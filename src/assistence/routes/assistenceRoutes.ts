import { Router } from "express";
import { getAssistenceAll , getAssistenceId, createAssistence, updateAssistence, deleteAssistence,  } from "../controllers/assistenceController";
import { authMiddleware } from '../../shared/middlewares/auth';

const assistenceRoutes: Router = Router();

assistenceRoutes.get('/', getAssistenceAll)
assistenceRoutes.get('/assistence_id', authMiddleware, getAssistenceId,)
assistenceRoutes.post("/", createAssistence)
assistenceRoutes.put("/:assistence_id", updateAssistence)
assistenceRoutes.delete("/:assistence_id", deleteAssistence)

export default assistenceRoutes;