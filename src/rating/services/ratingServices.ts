import { RatingRepository } from "../repositories/RatingRepositorie";
import { DateUtils } from "../../shared/utils/Date";
import { Rating } from "../models/Rating";

export class RatingService {

    public static async getAllRating(): Promise<Rating[]> {
        try {
            return await RatingRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error al obtener boletas: ${error.message}`);
        }
    }

    public static async getRatingtById(ratingId: number): Promise<Rating | null> {
        try {
            return await RatingRepository.findById(ratingId);
        } catch (error: any) {
            throw new Error(`Error al encontrar rating: ${error.message}`);
        }
    }

    public static async addRating(ballot: Rating): Promise<Rating> {
        try {
            ballot.created_at = DateUtils.formatDate(new Date());
            ballot.updated_at = DateUtils.formatDate(new Date());
            return await RatingRepository.createRating(ballot);
        } catch (error: any) {
            throw new Error(`Error al crear rating: ${error.message}`);
        }
    }

    public static async modifyRating(ratinId: number, ballotData: Rating): Promise<Rating | null> {
        try {
            const ballotFound = await RatingRepository.findById(ratinId);
            if (ballotFound) {
                if (ballotData.amount) {
                    ballotFound.amount = ballotData.amount;
                }
                if (ballotData.deleted) {
                    ballotFound.deleted = ballotData.deleted;
                }
                ballotFound.updated_by = ballotData.updated_by;
                ballotFound.updated_at = DateUtils.formatDate(new Date());
                return await RatingRepository.updateRating(ratinId, ballotFound);
            } else {
                return null;
            }
        } catch (error: any) {
            throw new Error(`Error al modificar boleta: ${error.message}`);
        }
    }

    public static async deleteRating(ratingId: number): Promise<boolean> {
        try {
            return await RatingRepository.deleteRating(ratingId);
        } catch (error: any) {
            throw new Error(`Error al eliminar boleta: ${error.message}`);
        }
    }
}
