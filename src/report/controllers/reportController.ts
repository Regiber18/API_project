import { Response, Request } from "express"
import { alumnService } from "../services/reportService"

export const getReportAll = async (_req: Request, res: Response) => {
  try {
    const reports = await alumnService.getAllReports()

    if(reports) {
      res.status(201).json(reports)
    }else {
      res.status(404).json(reports)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getTopics = async (_req: Request, res: Response) => {
  try {
    const reports = await alumnService.getTopicsReport()

    if(reports) {
      res.status(201).json(reports)
    }else {
      res.status(404).json(reports)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getReportId = async (req: Request, res: Response) => {
  try {
    const reports = await alumnService.getReportId(parseInt(req.params.report_id, 10))

    if(reports) {
      res.status(201).json(reports)
    }else {
      res.status(404).json(reports)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createReport = async (req: Request, res: Response) => {
  try {
    const newReport = await alumnService.addReport(req.body);

    if(newReport){
      res.status(201).json(newReport);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateReport = async (req: Request, res: Response) => {
  try {
    const updatedReport = await alumnService.modifyReport(parseInt(req.params.report_id, 10), req.body);

    if(updatedReport){
      res.status(201).json(updatedReport);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const deleted = await alumnService.deletReport(parseInt(req.params.report_id, 10));

    if(deleted) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {

  }

}
