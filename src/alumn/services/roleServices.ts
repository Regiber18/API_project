import { RoleRepository } from "../repositories/Role";
import { DateUtils } from "../../shared/utils/Date";
import { Rolle } from "../models/Rolle";


export class roleService {

    public static async getAllRoles(): Promise<Rolle[]> {
        try{
            return await RoleRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener role: ${error.message}`);
        }
    }

    public static async getEmployeeById(roleId: number): Promise<Rolle | null> {
        try{
            return await RoleRepository.findById(roleId);

        }catch (error: any){
            throw new Error(`Error al encontrar role: ${error.message}`);
        }
    }

    public static async addRole(role: Rolle) {
        try {
            role.created_at = DateUtils.formatDate(new Date());
            role.updated_at = DateUtils.formatDate(new Date());
            return await RoleRepository.createRole(role);
        } catch (error: any) {
            throw new Error(`Error al crear role: ${error.message}`);
        }
    }

    public static async modifyRole(roleId: number, roleData: Rolle){
        try{
            const roleFinded =  await RoleRepository.findById(roleId);
            if(roleFinded){
                if(roleData.management){
                    roleFinded.management = roleData.management;
                }
                if(roleData.escolarControl){
                    roleFinded.escolarControl = roleData.escolarControl;
                }
                if(roleData.deleted){
                    roleFinded.deleted = roleData.deleted;
                }
            }else{
                return null;
            }
            roleFinded.updated_by = roleData.updated_by
            roleFinded.updated_at = DateUtils.formatDate(new Date());
            return await RoleRepository.updateRole(roleId, roleFinded);
        }catch (error: any){
            throw new Error(`Error al modificar role: ${error.message}`);
        }
    }

    public static async deleteEmployee(personal_id: number): Promise<boolean> {
        try{
            return await RoleRepository.deleteRole(personal_id);

        }catch (error: any){
            throw new Error(`Error al eliminar role: ${error.message}`);
        }
    }

}