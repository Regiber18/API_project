import { Response, Request } from "express"
import { alumnService } from "../services/alumnServices"

export const getAlumnAll = async (_req: Request, res: Response) => {
  try {
    const alumns = await alumnService.getAllAlumns()

    if(alumns) {
      res.status(201).json(alumns)
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const getAlumnId = async (req: Request, res: Response) => {
  try {
    const alumns = await alumnService.getAlumnId(parseInt(req.params.alumn_id, 10))

    if(alumns) {
      res.status(201).json(alumns)
    }else {
      res.status(404).json(alumns)
    }
  }catch(err: any) {
    res.status(500).json({erro: err.message})
  }
}

export const createAlumn = async (req: Request, res: Response) => {
  try {
    const newEmployee = await alumnService.addAlumn(req.body);
    if(newEmployee){
      res.status(201).json(newEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const  updateALumn = async (req: Request, res: Response) => {
  try {
    const updatedEmployee = await alumnService.modifyAlumn(parseInt(req.params.alumnId, 10), req.body);
    if(updatedEmployee){
      res.status(201).json(updatedEmployee);
    }else{
      res.status(404).json({ message: 'Algo salio mal' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAlumn = async (req: Request, res: Response) => {
  try {
    const deleted = await alumnService.deletAlumn(parseInt(req.params.alumn_id, 10));

    if(deleted) {
      res.status(201).json({message: "salio bien"})
    }else {
      res.status(404).json({message: "algo salio mal"});
    }
  }catch(eer: any) {

  }

}

export const createpdf = async () => {
    try {
    const { PDFDocument, rgb } = require('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const alumn = "hola";
    const page = pdfDoc.addPage();

    page.drawText(`${alumn}`, {
      x: 50,
      y: 500,
      size: 50,
      color: rgb(0, 0.5, 0.75),
    });
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
    }catch(error: any) {
        console.log("erro")
    } 
  }