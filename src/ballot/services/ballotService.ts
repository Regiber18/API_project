import { BallotRepository } from "../repositories/BallotRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Ballot } from "../models/Ballot";
import * as dotenv from 'dotenv';
import  {  jsPDF  }  from  "jspdf" ;
dotenv.config();

export class BallotService {

    public static async getAllBallots(): Promise<Ballot[]> {
        try {
            return await BallotRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error al obtener boletas: ${error.message}`);
        }
    }

    public static async getBallotById(ballotId: number): Promise<Ballot | null> {
        try {
            return await BallotRepository.findById(ballotId);
        } catch (error: any) {
            throw new Error(`Error al encontrar boleta: ${error.message}`);
        }
    }

    public static async addBallot(ballot: Ballot) {
        const urlProject = process.env.URL; 
        const portProject = process.env.PORT; 

        try {
            
            const  doc  =  new  jsPDF ({ 
                orientation : "landscape" , 
                unit : "in" , 
                format : [ 4 ,  2 ] 
              });
              doc.setFontSize(18);
              doc.text("SISTEMA EDUCATIVO NACIONAL", 20, 20);
              doc.text("BOLETA DE EVALUACIÓN", 160, 20);
            
              // Nombre del alumno y Nombre de la Escuela
              doc.setFontSize(12);
              doc.text(`Nombre del alumno: `, 20, 30);
              doc.text(`Nombre de la Escuela:`, 160, 30);
            
              // Periodo de Evaluación Anual
              doc.text("Periodo de Evaluación Anual", 20, 40);
            
              // Tabla de Calificaciones
              doc.setFontSize(10);
              doc.setLineWidth(0.1);
              doc.rect(20, 50, 170, 10); // Encabezado de la tabla
              doc.text("Periodo", 25, 55);
              doc.text("Asignatura", 70, 55);
              doc.text("Calificación", 120, 55);
              doc.text("Observaciones", 160, 55);
            
              doc.rect(20, 60, 170, 10); // Primera fila de datos
              doc.text("",25, 65); // Calificación final

            
              // Observaciones
              doc.text("Sugerencias de los aprendizajes", 25, 85);
              doc.rect(20, 90, 170, 10); // Primera fila de observaciones
              // Aquí puedes continuar añadiendo más observaciones
            
              // Footer
              doc.setFontSize(8);
              doc.text("Firma del docente", 20, 280);
              doc.text("Nombre y firma de la directora o director", 70, 280);
              doc.text("Lugar de expedición", 120, 280);
              doc.text("Fecha de expedición", 160, 280);
              doc.text("Folio", 20, 285);
             const  save =  doc.save ( `pdf alumno_${ballot.alumn_id}.pdf` ) ; 

            const url = `${urlProject}: ${portProject}/pdfs/${save}`;  
            ballot.created_at = DateUtils.formatDate(new Date());
            ballot.updated_at = DateUtils.formatDate(new Date());
            ballot.url = url; 
            return await BallotRepository.createBallot(ballot);
        } catch (error: any) {
            throw new Error(`Error al crear boleta: ${error.message}`);
        }
    }

    public static async modifyBallot(ballotId: number, ballotData: Ballot): Promise<Ballot | null> {
        try {
            const ballotFound = await BallotRepository.findById(ballotId);
            if (ballotFound) {
                if (ballotData.observations) {
                    ballotFound.observations = ballotData.observations;
                }
                if(ballotData.rating) {
                    ballotFound.rating = ballotData.rating; 
                }
                if (ballotData.deleted) {
                    ballotFound.deleted = ballotData.deleted;
                }

                ballotFound.updated_by = ballotData.updated_by;
                ballotFound.updated_at = DateUtils.formatDate(new Date());
                return await BallotRepository.updateBallot(ballotId, ballotFound);
            } else {
                return null;
            }
        } catch (error: any) {
            throw new Error(`Error al modificar boleta: ${error.message}`);
        }
    }

    public static async deleteBallot(ballotId: number): Promise<boolean> {
        try {
            return await BallotRepository.deleteBallot(ballotId);
        } catch (error: any) {
            throw new Error(`Error al eliminar boleta: ${error.message}`);
        }
    }
}
