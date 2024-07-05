import { BallotRepository } from "../repositories/BallotRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Ballot } from "../models/Ballot";

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

    public static async addBallot(ballot: Ballot): Promise<Ballot> {
        try {
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
                if (ballotData.content) {
                    ballotFound.content = ballotData.content;
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
