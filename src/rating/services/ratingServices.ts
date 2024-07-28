import { RatingRepository } from "../repositories/RatingRepositorie";
import { DateUtils } from "../../shared/utils/Date";
import { Rating } from "../models/Rating";
import { subjectRating } from "../../subject/models/subjectRating";

export class RatingService {

    public static async getAllRating(): Promise<Rating[]> {
        try {
            return await RatingRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error al obtener boletas: ${error.message}`);
        }
    }


    public static async getAllSR(): Promise<subjectRating[]> {
        try {
            return await RatingRepository.findSR();
        } catch (error: any) {
            throw new Error(`Error al obtener boletas: ${error.message}`);
        }
    }

    public static async getRatingId(): Promise<Rating[]> {
        try {
            return await RatingRepository.findRatingId();
        } catch (error: any) {
            throw new Error(`Error al obtener boletas: ${error.message}`);
        }
    }

    public static async getAmountRating(): Promise<Rating[]> {
        try {
            return await RatingRepository.findAmountRating();
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
            if(ballot.gradePertenence > 6 || ballot.gradePertenence < 0) {
                throw new Error("Debe ingrsar un grado valido")
            }

            if(ballot.amount > 10 || ballot.amount < 0) {
                throw new Error("Debe se una calificación validad")
            }

            ballot.created_at = DateUtils.formatDate(new Date());
            ballot.updated_at = DateUtils.formatDate(new Date());
    
            const subjectID = await RatingRepository.getIDSUbjectSpanish();
            const subjectIDMath = await RatingRepository.getIDSUbjectMath()
            const subjectIDCience = await RatingRepository.getIDSUbjectCience()

            const newRating = await RatingRepository.createRating(ballot);
            if (!subjectID) {
                throw new Error('No se encontró el subject con el nombre "Español".');
            }else {
                await RatingRepository.createsubjectRating(subjectID, newRating.rating_id);
            }

            if(!subjectIDMath) {
                throw new Error('No se encontró el subject con el nombre "Matematicas"')
            }else {
                await RatingRepository.createsubjectRating(subjectIDMath, newRating.rating_id)
            }

            if(!subjectIDCience) {
                console.log("no se encontro");
                
            }else {

            }

            return newRating;
            
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
