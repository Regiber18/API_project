import { Router } from "express";
import { getReportAll , getReportId, createReport, updateReport, deleteReport,  } from "../controllers/reportController";
import { authMiddleware } from '../../shared/middlewares/auth';

const reportRoutes: Router = Router();

reportRoutes.get('/', getReportAll)
reportRoutes.get('/:alumn_id', authMiddleware, getReportId,)
reportRoutes.post("/", createReport)
reportRoutes.put("/:alumn_id", updateReport)
reportRoutes.delete("/:alumn_id", deleteReport)

export default reportRoutes;