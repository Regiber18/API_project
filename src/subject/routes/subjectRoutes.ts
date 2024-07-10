import { Router } from "express";
import { getSubjectAll , getSubjectId, createSubject, updateSubject, deleteSubject,  } from "../controllers/subjectController";
import { authMiddleware } from '../../shared/middlewares/auth';

const subjectRoutes: Router = Router();

subjectRoutes.get('/', getSubjectAll)
subjectRoutes.get('/subject_id', authMiddleware, getSubjectId,)
subjectRoutes.post("/", createSubject)
subjectRoutes.put("/:subject_id", updateSubject)
subjectRoutes.delete("/:subject_id", deleteSubject)

export default subjectRoutes;