import { BallotRepository } from "../repositories/BallotRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Ballot } from "../models/Ballot";
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
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

    public static async getUrlBallot(): Promise<Ballot[]> {
        try {
            return await BallotRepository.findUrlBallot();
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
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: 'letter' // Usa tamaño carta para pruebas
            });

            // Texto de prueba
            doc.setFontSize(18);
            doc.text("SISTEMA EDUCATIVO NACIONAL", 1, 1);
            doc.text("BOLETA DE EVALUACIÓN", 1, 2);

            doc.setFontSize(12);
            doc.text(`Id del alumno: ${ballot.alumn_id} `, 1, 3);
            doc.text(`Nombre de la Escuela:`, 1, 4);

            doc.text("Periodo de Evaluación Anual", 1, 5);
            doc.text(`calificción final: ${ballot.rating}`, 1, 6)

            doc.text(`observaciones: ${ballot.observations}`, 1, 7)

            const uniqueId = uuidv4(); // uuid para nombre
            const pdfPath = `boleta_alumno_${ballot.alumn_id}_${uniqueId}.pdf`;

            // Guardar PDF
            doc.save(pdfPath);

            // Generar la URL para el PDF guardado
            ballot.created_at = DateUtils.formatDate(new Date());
            ballot.updated_at = DateUtils.formatDate(new Date());
            ballot.url = `${urlProject}:${portProject}/pdfs/${pdfPath}`;

            // Guardar la boleta en la base de datos
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
