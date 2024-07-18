import { Router } from "express";
import { getSubjectRatingAll , getSubjectRatingId, createSubjectRating, updateSubjectRating, deleteSubjectRating,  } from "../controllers/subjectRatingController";
import { authMiddleware } from '../../shared/middlewares/auth';

const subjectRoutes: Router = Router();

subjectRoutes.get('/', getSubjectRatingAll)
subjectRoutes.get('/subjectrating_id', authMiddleware, getSubjectRatingId,)
subjectRoutes.post("/", createSubjectRating)
subjectRoutes.put("/:subjectrating_id", updateSubjectRating)
subjectRoutes.delete("/:subjectrating_id", deleteSubjectRating)

export default subjectRoutes;