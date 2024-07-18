import { Router } from "express";
import { getSubjectAll , getSubjectId, createSubject, updateSubject, deleteSubject,  } from "../controllers/subjectController";
import { authMiddleware } from '../../shared/middlewares/auth';

const subjectRatingRoutes: Router = Router();

subjectRatingRoutes.get('/', getSubjectAll)
subjectRatingRoutes.get('/subject_id', authMiddleware, getSubjectId,)
subjectRatingRoutes.post("/", createSubject)
subjectRatingRoutes.put("/:subject_id", updateSubject)
subjectRatingRoutes.delete("/:subject_id", deleteSubject)

export default subjectRatingRoutes;