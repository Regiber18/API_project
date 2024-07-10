import { Response, Request } from "express"
import { alumnService } from "../services/reportService"

export const getReportAll = async (_req: Request, res: Response) => {
  try {
    const alumns = await alumnService.getAllReports()

    if(alumns) {
      res.status(201).json(alumns)
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getReportId = async (req: Request, res: Response) => {
  try {
    const alumns = await alumnService.getReportId(parseInt(req.params.report_id, 10))

    if(alumns) {
      res.status(201).json(alumns)
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createReport = async (req: Request, res: Response) => {
  try {
    const newEmployee = await alumnService.addReport(req.body);
    if(newEmployee){
      res.status(201).json(newEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateReport = async (req: Request, res: Response) => {
  try {
    const updatedEmployee = await alumnService.modifyReport(parseInt(req.params.report_id, 10), req.body);
    if(updatedEmployee){
      res.status(201).json(updatedEmployee);
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
