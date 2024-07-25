import { RoleRepository } from "../repositories/RoleRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Role } from "../models/Role";


export class roleService {

    public static async getAllRoles(): Promise<Role[]> {
        try{
            return await RoleRepository.findAll();
        }catch (error: any){
            throw new Error(`Error al obtener roles: ${error.message}`);
        }
    }

    public static async getRolesAct(): Promise<Role[]> {
        try{
            return await RoleRepository.findAllRolesAct();
        }catch (error: any){
            throw new Error(`Error al obtener roles: ${error.message}`);
        }
    }

    public static async getRoleId(roleId: number): Promise<Role | null> {
        try{
            return await RoleRepository.findById(roleId);

        }catch (error: any){
            throw new Error(`Error al encontrar role: ${error.message}`);
        }
    }

    public static async addRole(role: Role) {
        try {
            role.created_at = DateUtils.formatDate(new Date());
            role.updated_at = DateUtils.formatDate(new Date());
            return await RoleRepository.createRole(role);
        } catch (error: any) {
            throw new Error(`Error al crear role: ${error.message}`);
        }
    }

    public static async modifyRole(roleId: number, roleData: Role){
        try{
            const roleFinded =  await RoleRepository.findById(roleId);
    
            if(roleFinded){
                if(roleData.description){
                    roleFinded.description = roleData.description;
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

    public static async deleteRole(role_id: number): Promise<boolean> {
        try{
            return await RoleRepository.deletePersonal(role_id);

        }catch (error: any){
            throw new Error(`Error al eliminar role: ${error.message}`);
        }
    }

}