import { SubjectRepository } from "../repositories/subjectRepositorie";
import { DateUtils } from "../../shared/utils/Date";
import { Subject } from "../models/Subject";


export class subjectService {

    public static async getAllSubjects(): Promise<Subject[]> {
        try{
            return await SubjectRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener subjects: ${error.message}`);
        }
    }

    public static async getSubjectId(employeeId: number): Promise<Subject | null> {
        try{
            return await SubjectRepository.findById(employeeId);

        }catch (error: any){
            throw new Error(`Error al encontrar subject: ${error.message}`);
        }
    }

    public static async addSubject(subject: Subject) {
        try {
            subject.created_at = DateUtils.formatDate(new Date());
            subject.updated_at = DateUtils.formatDate(new Date());
            return await SubjectRepository.createSubject(subject);
        } catch (error: any) {
            throw new Error(`Error al crear subject: ${error.message}`);
        }
    }

    public static async modifySubject(subjectId: number, subjectData: Subject){
        try{
            const subjectFinded =  await SubjectRepository.findById(subjectId);
    
            if(subjectFinded){
                if(subjectData.name){
                    subjectFinded.name = subjectData.name;
                }
                if(subjectData.deleted){
                    subjectFinded.deleted = subjectData.deleted;
                }
            }else{
                return null;
            }
            subjectFinded.updated_by = subjectData.updated_by
            subjectFinded.updated_at = DateUtils.formatDate(new Date());
            return await SubjectRepository.updateSubject(subjectId, subjectFinded);
        }catch (error: any){
            throw new Error(`Error al modificar subject: ${error.message}`);
        }
    }

    public static async deletSubject(subject_id: number): Promise<boolean> {
        try{
            return await SubjectRepository.deleteSubject(subject_id);

        }catch (error: any){
            throw new Error(`Error al eliminar subject: ${error.message}`);
        }
    }

}