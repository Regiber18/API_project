import { AlumnRepository } from "../repositories/AlumnRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Alumns } from "../models/Alumns";


export class alumnService {

    public static async getAllAlumns(): Promise<Alumns[]> {
        try{
            return await AlumnRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener alumnos: ${error.message}`);
        }
    }

    public static async getNameComplete(): Promise<Alumns[]> {
        try{
            return await AlumnRepository.findName();
        }catch (error: any){
            throw new Error(`Error al obtener alumnos: ${error.message}`);
        }
    }

    public static async getAlumnId(employeeId: number): Promise<Alumns | null> {
        try{
            return await AlumnRepository.findById(employeeId);

        }catch (error: any){
            throw new Error(`Error al encontrar alumno: ${error.message}`);
        }
    }

    public static async addAlumn(alumn: Alumns) {
        try {
            alumn.created_at = DateUtils.formatDate(new Date());
            alumn.updated_at = DateUtils.formatDate(new Date());
            return await AlumnRepository.createAlumn(alumn);
        } catch (error: any) {
            throw new Error(`Error al crear alumno: ${error.message}`);
        }
    }

    public static async modifyAlumn(alumnId: number, alumnData: Alumns){
        try{
            const alumnFinded =  await AlumnRepository.findById(alumnId);
    
            if(alumnFinded){
                if(alumnData.name){
                    alumnFinded.name = alumnData.name;
                }
                if(alumnData.lastName){
                    alumnFinded.lastName = alumnData.lastName;
                }
                if(alumnData.deleted){
                    alumnFinded.deleted = alumnData.deleted;
                }
            }else{
                return null;
            }
            alumnFinded.updated_by = alumnData.updated_by
            alumnFinded.updated_at = DateUtils.formatDate(new Date());
            return await AlumnRepository.updateAlumn(alumnId, alumnFinded);
        }catch (error: any){
            throw new Error(`Error al modificar alumno: ${error.message}`);
        }
    }

    public static async deletAlumn(alumn_id: number): Promise<boolean> {
        try{
            return await AlumnRepository.deleteAlumn(alumn_id);

        }catch (error: any){
            throw new Error(`Error al eliminar alumno: ${error.message}`);
        }
    }

}