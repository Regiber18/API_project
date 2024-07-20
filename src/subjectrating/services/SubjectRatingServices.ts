import { SubjectRepository } from "../repositories/SubjectRatingRepositorie";
import { SubjectRating } from "../models/SubjectRating";


export class subjectRatingService {

    public static async getAllSubjectsRating(): Promise<SubjectRating[]> {
        try{
            return await SubjectRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener subjects: ${error.message}`);
        }
    }

    public static async getSubjectRatingId(subjectrating: number): Promise<SubjectRating | null> {
        try{
            return await SubjectRepository.findById(subjectrating);

        }catch (error: any){
            throw new Error(`Error al encontrar subject: ${error.message}`);
        }
    }

    public static async addSubjectRating(subject: SubjectRating) {
        try {
            return await SubjectRepository.createSubjectRating(subject);
        } catch (error: any) {
            throw new Error(`Error al crear subject: ${error.message}`);
        }
    }

    public static async modifySubjectRating(subjectratingId: number, subjectData: SubjectRating){
        try{
            const subjectFinded =  await SubjectRepository.findById(subjectratingId);
    
            if(subjectFinded){
                if(subjectData.all_ids){
                    subjectFinded.all_ids = subjectData.all_ids;
                }
            }else{
                return null;
            }
            return await SubjectRepository.updateSubjectRating(subjectratingId, subjectFinded);
        }catch (error: any){
            throw new Error(`Error al modificar subject: ${error.message}`);
        }
    }

    public static async deletSubjectRating(subjectrating_id: number): Promise<boolean> {
        try{
            return await SubjectRepository.deleteSubject(subjectrating_id);

        }catch (error: any){
            throw new Error(`Error al eliminar subject: ${error.message}`);
        }
    }

}