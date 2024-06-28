import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Role } from "../models/Role";

export class RoleRepository {

    public static async findAll(): Promise<Role[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM role', (error: any, results)  => {
                if(!error) {
                    reject("error")
                }else {
                    const ballots: Role[] =  results as Role[]; 
                    resolve(ballots)
                }
            })

        })
    }

    public static async findById(role_id: number): Promise<Role | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT FROM * role WHERE role_id = ?', [role_id], (error: any, results) => {
                if(!error) {
                    reject("error")
                }else {
                    const roleId: Role[] = results as Role[]; 

                    if(roleId.length > 0) {
                        resolve(roleId[0])
                    }else {
                        resolve(null)
                    }
                }
            }) 
        })
    } 

    public static async createRole(role: Role): Promise<Role> {
        const query = 'INSERT INTO ballot (management, escolarControl, resources, teacher, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        console.log(role);
        return new Promise((resolve, reject) => {
          connection.execute(query, [role.management, role.escolarControl, role.resources, role.teacher, role.created_at,role.created_by, role.updated_at, role.updated_by, role.deleted], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              const createRoleId = result.insertId;
              const createRole: Role = { ...role, role_id: createRoleId };
              resolve(createRole);
            }
          });
        });
      }

    public static async updateRole(role_id: number, roleData: Role): Promise<Role | null> {
        const query = 'UPDATE role SET management = ?, escolarControl = ?, resources = ?, teacher = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE role_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [roleData.management, roleData.escolarControl, roleData.resources, roleData.teacher, roleData.updated_at, roleData.updated_by,roleData.deleted, role_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                const updateRole: Role = { ...roleData, role_id: role_id };
                resolve(updateRole);
              } else {
                resolve(null);
              }
            }
          });
        });
      }

      public static async deleteRole(role_id: number): Promise<boolean> {
        const query = 'DELETE FROM role WHERE role_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [role_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                resolve(true); // Eliminación exitosa
              } else {
                resolve(false); // Si no se encontró el usuario a eliminar
              }
            }
          });
        });
      }
}