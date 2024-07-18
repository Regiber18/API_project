import { Router } from "express";
import { getSubjectRatingAll , getSubjectRatingId, createSubjectRating, updateSubjectRating, deleteSubjectRating,  } from "../controllers/subjectRatingController";
import { authMiddleware } from '../../shared/middlewares/auth';

const subjectRatingRoutes: Router = Router();

subjectRatingRoutes.get('/', getSubjectRatingAll)
subjectRatingRoutes.get('/subject_id', authMiddleware, getSubjectRatingId,)
subjectRatingRoutes.post("/", createSubjectRating)
subjectRatingRoutes.put("/:subject_id", updateSubjectRating)
subjectRatingRoutes.delete("/:subject_id", deleteSubjectRating)

export default subjectRatingRoutes;