import { Router } from "express";
import { getSubjectAll , getSubjectId, getSubjectRatingEspañol,createSubject, getSubjectAllSubjectRating ,updateSubject, deleteSubject,  } from "../controllers/subjectController";
import { authMiddleware } from '../../shared/middlewares/auth';

const subjectRatingRoutes: Router = Router();

subjectRatingRoutes.get('/', getSubjectAll)
subjectRatingRoutes.get('/getSubjectRating', getSubjectAllSubjectRating)
subjectRatingRoutes.get('/subject_id', authMiddleware, getSubjectId,)
subjectRatingRoutes.get("/espa", getSubjectRatingEspañol)
subjectRatingRoutes.post("/", createSubject)
subjectRatingRoutes.put("/:subject_id", updateSubject)
subjectRatingRoutes.delete("/:subject_id", deleteSubject)

export default subjectRatingRoutes;