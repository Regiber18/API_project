import { Router } from "express";
import { getReportAll , getReportId, createReport, updateReport, deleteReport,  } from "../controllers/reportController";


const reportRoutes: Router = Router();

reportRoutes.get('/', getReportAll)
reportRoutes.get('/:report_id', getReportId,)
reportRoutes.post("/", createReport)
reportRoutes.put("/:report_id", updateReport)
reportRoutes.delete("/:report_id", deleteReport)

export default reportRoutes;