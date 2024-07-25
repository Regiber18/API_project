import { GroupRepository } from "../repositories/ClassRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Class } from "../models/Class";


export class groupService {

    public static async getAllClass(): Promise<Class[]> {
        try{
            return await GroupRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener clases: ${error.message}`);
        }
    }

    public static async getClassInformation(): Promise<Class[]> {
        try{
            return await GroupRepository.findClass();
        }catch (error: any){
            throw new Error(`Error al obtener clases: ${error.message}`);
        }
    }

    public static async getClassId(classId: number): Promise<Class | null> {
        try{
            return await GroupRepository.findById(classId);

        }catch (error: any){
            throw new Error(`Error al encontrar clase: ${error.message}`);
        }
    }

    public static async addClass(clas: Class) {
        try {
            clas.created_at = DateUtils.formatDate(new Date());
            clas.updated_at = DateUtils.formatDate(new Date());
            return await GroupRepository.createClass(clas);
        } catch (error: any) {
            throw new Error(`Error al crear clase: ${error.message}`);
        }
    }

    public static async modifyClass(class_id: number, groupData:Class){
        try{
            const groupFinded =  await GroupRepository.findById(class_id);
            if(groupFinded){
                if(groupData.className){
                    groupFinded.className = groupData.className;
                }
                if(groupData.classGrade) {
                    groupFinded.classGrade = groupData.classGrade;
                }
                if(groupData.deleted){
                    groupFinded.deleted = groupData.deleted;
                }
            }else{
                return null;
            }
            groupFinded.updated_by = groupData.updated_by
            groupFinded.updated_at = DateUtils.formatDate(new Date());
            return await GroupRepository.updateClass(class_id, groupFinded);
        }catch (error: any){
            throw new Error(`Error al modificar clase: ${error.message}`);
        }
    }

    public static async deleteClass(class_id: number): Promise<boolean> {
        try{
            return await GroupRepository.deleteClass(class_id);

        }catch (error: any){
            throw new Error(`Error al eliminar clase: ${error.message}`);
        }
    }

}