import { Router } from "express";
import { getSubjectAll , getSubjectId, getSubjectRatingEspañol,createSubject, getSubjectAllSubjectRating ,updateSubject, deleteSubject, getSubjectRatingMath, getSubjectRatingCience,  } from "../controllers/subjectController";
import { authMiddleware } from '../../shared/middlewares/auth';

const subjectRatingRoutes: Router = Router();

subjectRatingRoutes.get('/', getSubjectAll)
subjectRatingRoutes.get('/getSubjectRating', getSubjectAllSubjectRating)
subjectRatingRoutes.get('/subject_id', authMiddleware, getSubjectId,)
//join materia
subjectRatingRoutes.get("/espa", getSubjectRatingEspañol)
subjectRatingRoutes.get("/math", getSubjectRatingMath)
subjectRatingRoutes.get('/cience', getSubjectRatingCience)
//
subjectRatingRoutes.post("/", createSubject)
subjectRatingRoutes.put("/:subject_id", updateSubject)
subjectRatingRoutes.delete("/:subject_id", deleteSubject)

export default subjectRatingRoutes;