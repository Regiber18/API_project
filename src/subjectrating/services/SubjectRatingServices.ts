import { SubjectRepository } from "../repositories/SubjectRatingRepositorie";
import { SubjectRating } from "../models/SubjectRating";


export class subjectService {

    public static async getAllSubjectsRating(): Promise<SubjectRating[]> {
        try{
            return await SubjectRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener subjectsrating: ${error.message}`);
        }
    }

    public static async getSubjectRatingId(employeeId: number): Promise<SubjectRating | null> {
        try{
            return await SubjectRepository.findById(employeeId);

        }catch (error: any){
            throw new Error(`Error al encontrar subject: ${error.message}`);
        }
    }

    public static async addSubject(subjectrating: SubjectRating) {
        try {
            return await SubjectRepository.createSubject(subjectrating);
        } catch (error: any) {
            throw new Error(`Error al crear subject: ${error.message}`);
        }
    }

    public static async modifySubjectRating(subjectratingId: number, subjectratingData: SubjectRating){
        try{
            const subjectFinded =  await SubjectRepository.findById(subjectratingId);
    
            if(subjectFinded){
                if(subjectratingData.subeject_rating_id){
                    subjectFinded.subeject_rating_id = subjectratingData.subeject_rating_id;
                }
            }else{
                return null;
            }
            return await SubjectRepository.updateSubject(subjectratingId, subjectFinded);
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