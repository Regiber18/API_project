import { SubjectRepository } from "../repositories/subjectRepositorie";
import { DateUtils } from "../../shared/utils/Date";
import { Subject } from "../models/Subject";
import { subjectRating } from "../models/subjectRating";
import { subjectRatingEspañol } from "../models/subjectsRatingEspañol";
import { AlumnRepository } from "../../alumn/repositories/AlumnRepository";



export class subjectService {

    public static async getAllSubjects(): Promise<Subject[]> {
        try{
            return await SubjectRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener subjects: ${error.message}`);
        }
    }

    public static async getAllSubjectRating(): Promise<subjectRating[]> {
        try{
            return await SubjectRepository.findAllSubjectRating();
        }catch (error: any){
            throw new Error(`Error al obtener subjects: ${error.message}`);
        }
    }

    public static async getTotalAmountForAllAlumns(): Promise<{ alumn_id: number, averageAmount: number }[]> {
        try {
            const alumns = await AlumnRepository.findAllIds(); 
            const result: { alumn_id: number, averageAmount: number }[] = [];
    
            for (const alumn of alumns) {
                const amountsAll = await SubjectRepository.getAllRatingId(alumn.alumn_id); 
    
                console.log('Amounts por alumn_id', alumn.alumn_id, amountsAll); 
                
                if (amountsAll.length === 0) {
                    result.push({ alumn_id: alumn.alumn_id, averageAmount: 0 });
                    continue;
                }
                
                let totalAmount = 0;
                for (const item of amountsAll) {
                    if (item && 'amount' in item) {
                        totalAmount += item.amount; 
                    } else {
                        console.warn('!estructura:', item);
                    }
                }
                
                const averageAmount = totalAmount / amountsAll.length;
            
                result.push({ alumn_id: alumn.alumn_id, averageAmount });
            }
    
            return result;
        } catch (error: any) {
            throw new Error(`Error al obtener la suma total de calificaciones para los alumnos: ${error.message}`);
        }
    }
    
    
    
    

    public static async getSubjectRatinSpanish(): Promise<subjectRatingEspañol[]> {
        try{
            return await SubjectRepository.getSubjectRatingSpanish();
        }catch (error: any){
            throw new Error(`Error al obtener subject rating español: ${error.message}`);
        }
    }

    public static async getSubjectRatinMath(): Promise<subjectRatingEspañol[]> {
        try{
            return await SubjectRepository.getSubjectRatingMath();
        }catch (error: any){
            throw new Error(`Error al obtener subject rating matematícas: ${error.message}`);
        }
    }

    public static async getSubjectRatinCience(): Promise<subjectRatingEspañol[]> {
        try{
            return await SubjectRepository.getSubjectRatingCience();
        }catch (error: any){
            throw new Error(`Error al obtener subject rating ciencia: ${error.message}`);
        }
    }

    public static async getAMountFinal() {
        try{

        }catch(error: any) {
            throw new Error(error)
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