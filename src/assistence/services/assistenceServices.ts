import { AssistenceRepository } from "../repositories/assistenceRepositorie";
import { DateUtils } from "../../shared/utils/Date";
import { Assistence } from "../models/assitence";


export class assistenceService {

    public static async getAllAssistence(): Promise<Assistence[]> {
        try{
            return await AssistenceRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener aisstencias: ${error.message}`);
        }
    }

    public static async getAssistenceId(assistenceId: number): Promise<Assistence | null> {
        try{
            return await AssistenceRepository.findById(assistenceId);

        }catch (error: any){
            throw new Error(`Error al encontrar asistencia: ${error.message}`);
        }
    }

    public static async addAssistence(assistence: Assistence) {
        try {
            assistence.created_at = DateUtils.formatDate(new Date());
            assistence.updated_at = DateUtils.formatDate(new Date());
            return await AssistenceRepository.createAssistence(assistence);
        } catch (error: any) {
            throw new Error(`Error al crear asistencia: ${error.message}`);
        }
    }

    public static async modifyAssistence(assistenceId: number, assistenceData: Assistence){
        try{
            const assistenceFinded =  await AssistenceRepository.findById(assistenceId);
    
            if(assistenceFinded){
                if(assistenceData.status){
                    assistenceFinded.status = assistenceData.status;
                }
                if(assistenceData.deleted){
                    assistenceFinded.deleted = assistenceData.deleted;
                }
            }else{
                return null;
            }
            assistenceFinded.updated_by = assistenceData.updated_by
            assistenceFinded.updated_at = DateUtils.formatDate(new Date());
            return await AssistenceRepository.updateAssistence(assistenceId, assistenceFinded);
        }catch (error: any){
            throw new Error(`Error al modificar asistencia: ${error.message}`);
        }
    }

    public static async deletAssistence(assistence_id: number): Promise<boolean> {
        try{
            return await AssistenceRepository.deleteAssistence(assistence_id);

        }catch (error: any){
            throw new Error(`Error al eliminar asistencia: ${error.message}`);
        }
    }

}