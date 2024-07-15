import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Role } from "../models/Role";

export class RoleRepository {

    public static async findAll(): Promise<Role[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Role', (error: any, results)  => {
                if(error) {
                    reject("error")
                }else {
                    const personal: Role[] =  results as Role[]; 
                    resolve(personal)
                }
            })

        })
    }

    public static async findById(role_id: number): Promise<Role | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Role WHERE role_id = ?', [role_id], (error: any, results) => {
                if(error) {
                    reject("error")
                }else {
                    const RoleId: Role[] = results as Role[]; 

                    if(RoleId.length > 0) {
                        resolve(RoleId[0])
                    }else {
                        resolve(null)
                    }
                }
            }) 
        })
    } 

    public static async createRole(role: Role): Promise<Role> {
        const query = 'INSERT INTO Role(description, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)';
        console.log(role);
        return new Promise((resolve, reject) => {
          connection.execute(query, [role.description, role.created_at, role.created_by, role.updated_at, role.updated_by, role.deleted], (error, result: ResultSetHeader) => {
            if (error) {
                reject(error);
            } else {
              const createRoleId = result.insertId;
              const createGroup: Role = { ...role, role_id: createRoleId };
              resolve(createGroup);
            }
          });
        });
      }

    public static async updateRole(role_id: number, roleData: Role): Promise<Role | null> {
        const query = 'UPDATE Role SET description = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE role_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [roleData.description,roleData.updated_at, roleData.updated_by,roleData.deleted, role_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                const updatePersonal: Role = { ...roleData, role_id: role_id };
                resolve(updatePersonal);
              } else {
                resolve(null);
              }
            }
          });
        });
      }

      public static async deletePersonal(role_id: number): Promise<boolean> {
        const query = 'DELETE FROM Role WHERE role_id = ?';
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