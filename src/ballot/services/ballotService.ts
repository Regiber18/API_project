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
              doc . text ( `${ballot.rating}` ,  1 ,  1 ) ; 
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
                if (ballotData.name) {
                    ballotFound.name = ballotData.name;
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
