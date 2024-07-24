import { BallotRepository } from "../repositories/BallotRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Ballot } from "../models/Ballot";
import * as dotenv from 'dotenv';
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

    public static async addBallot(ballot: Ballot, file: Express.Multer.File) {
        const urlProject = process.env.URL; 
        const portProject = process.env.PORT; 

        try {
            ballot.url = `${urlProject}: ${portProject}/pdfs/${file.filename}`;
            ballot.created_at = DateUtils.formatDate(new Date());
            ballot.updated_at = DateUtils.formatDate(new Date());
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
                if(ballotData.url) {
                    ballotFound.url = ballotData.url; 
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
