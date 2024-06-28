import { GroupRepository } from "../repositories/GroupRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Group } from "../models/Group";


export class groupService {

    public static async getAllEmployees(): Promise<Group[]> {
        try{
            return await GroupRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener grupos: ${error.message}`);
        }
    }

    public static async getEmployeeById(employeeId: number): Promise<Group | null> {
        try{
            return await GroupRepository.findById(employeeId);

        }catch (error: any){
            throw new Error(`Error al encontrar grupo: ${error.message}`);
        }
    }

    public static async addGroup(group: Group) {
        try {
            group.created_at = DateUtils.formatDate(new Date());
            group.updated_at = DateUtils.formatDate(new Date());
            return await GroupRepository.createGroup(group);
        } catch (error: any) {
            throw new Error(`Error al crear grupo: ${error.message}`);
        }
    }

    public static async modifyGroup(ballot_id: number, groupData:Group){
        try{
            const groupFinded =  await GroupRepository.findById(ballot_id);
            if(groupFinded){
                if(groupData.name){
                    groupFinded.name = groupData.name;
                }
                if(groupData.grade) {
                    groupFinded.grade = groupData.grade;
                }
                if(groupData.deleted){
                    groupFinded.deleted = groupData.deleted;
                }
            }else{
                return null;
            }
            groupFinded.updated_by = groupData.updated_by
            groupFinded.updated_at = DateUtils.formatDate(new Date());
            return await GroupRepository.updateGroup(ballot_id, groupFinded);
        }catch (error: any){
            throw new Error(`Error al modificar grupo: ${error.message}`);
        }
    }

    public static async deleteEmployee(group_id: number): Promise<boolean> {
        try{
            return await GroupRepository.deleteGroup(group_id);

        }catch (error: any){
            throw new Error(`Error al eliminar grupo: ${error.message}`);
        }
    }

}