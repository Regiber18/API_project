import { RatingRepository } from "../repositories/RatingRepositorie";
import { DateUtils } from "../../shared/utils/Date";
import { Rating } from "../models/Rating";
import { subjectRating } from "../../subject/models/subjectRating";
import { AmountSpanish } from "../models/AmountSpanish";

export class RatingService {

    public static async getAllRating(): Promise<Rating[]> {
        try {
            return await RatingRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error al obtener ratings: ${error.message}`);
        }
    }


    public static async getAllSR(): Promise<subjectRating[]> {
        try {
            return await RatingRepository.findSR();
        } catch (error: any) {
            throw new Error(`Error al obtener subjectRating: ${error.message}`);
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

    public static async getAllSpanishMount(): Promise<AmountSpanish[]> {
        try {
            return await RatingRepository.getDataSpanish();
        } catch (error: any) {
            throw new Error(`Error al obtener al obtener el amount: ${error.message}`);
        }
    }



    public static async addRating(ballot: Rating): Promise<Rating> {
        try {

            if (ballot.gradePertenence > 6 || ballot.gradePertenence < 0) {
                throw new Error("Debe ingresar un grado válido");
            }
    
            if (ballot.amount > 10 || ballot.amount < 4) {
                throw new Error("Debe ser una calificación válida");
            }
    

            const allRatingsSearch = await RatingRepository.findAmountRating(); 
            let flag = false;
            for (let i = 0; i < allRatingsSearch.length; i++) {
                if (allRatingsSearch[i].pertenence === ballot.pertenence && allRatingsSearch[i].alumn_id === ballot.alumn_id) {
                    flag = true;
                    break;
                }
            }
    
            if (flag) {
                throw new Error("Ya existe una calificación para este alumno y pertenencia");
            }
    
            ballot.created_at = DateUtils.formatDate(new Date());
            ballot.updated_at = DateUtils.formatDate(new Date());
    
            const subjectID = await RatingRepository.getIDSUbjectSpanish();
            const subjectIDMath = await RatingRepository.getIDSUbjectMath();
            const subjectIDCience = await RatingRepository.getIDSUbjectCience();
    

            const newRating = await RatingRepository.createRating(ballot);
    
            if (!subjectID) {
                throw new Error('No se encontró el subject con el nombre "Español".');
            } else {
                await RatingRepository.createsubjectRating(subjectID, newRating.rating_id);
            }

            if (!subjectIDMath) {
                throw new Error('No se encontró el subject con el nombre "Matemáticas".');
            } else {
                await RatingRepository.createsubjectRating(subjectIDMath, newRating.rating_id);
            }
            if (!subjectIDCience) {
                throw new Error('No se encontró el subject con el nombre "Ciencias".');
            } else {
                await RatingRepository.createsubjectRating(subjectIDCience, newRating.rating_id);
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
                if(ballotData.alumn_id) {
                    ballotFound.alumn_id = ballotData.alumn_id;
                }
                if (ballotData.pertenence) {
                    ballotFound.pertenence = ballotData.pertenence;
                }
                if (ballotData.gradePertenence) {
                    ballotFound.gradePertenence = ballotData.gradePertenence;
                }
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
