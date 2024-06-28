import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Personal } from "../models/Personal";

export class PersonalRepository {

    public static async findAll(): Promise<Personal[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT personal_id, name FROM personal', (error: any, results)  => {
                if(error) {
                    reject("error")
                }else {
                    const personal: Personal[] =  results as Personal[]; 
                    resolve(personal)
                }
            })

        })
    }

    public static async findById(personal_id: number): Promise<Personal | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM personal WHERE personal_id = ?', [personal_id], (error: any, results) => {
                if(!error) {
                    reject("error")
                }else {
                    const personalId: Personal[] = results as Personal[]; 

                    if(personalId.length > 0) {
                        resolve(personalId[0])
                    }else {
                        resolve(null)
                    }
                }
            }) 
        })
    } 

    public static async createPersonal(personal: Personal): Promise<Personal> {
        const query = 'INSERT INTO personal (name, created_at, created_by, updated_at, updated_by, deleted, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
        console.log(personal);
        return new Promise((resolve, reject) => {
          connection.execute(query, [personal.name,personal.created_at,personal.created_by, personal.updated_at, personal.updated_by, personal.deleted,personal.password], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              const createGroupId = result.insertId;
              const createGroup: Personal = { ...personal, personal_id: createGroupId };
              resolve(createGroup);
            }
          });
        });
      }

    public static async updatePersonal(personal_id: number, personalData: Personal): Promise<Personal | null> {
        const query = 'UPDATE personal SET name = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE group_id = ?, password = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [personalData.name,personalData.updated_at, personalData.updated_by,personalData.deleted,personalData.password, personal_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                const updatePersonal: Personal = { ...personalData, personal_id: personal_id };
                resolve(updatePersonal);
              } else {
                resolve(null);
              }
            }
          });
        });
      }

      public static async deletePersonal(personal_id: number): Promise<boolean> {
        const query = 'DELETE FROM personal WHERE personal_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [personal_id], (error, result: ResultSetHeader) => {
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

      public static async findByFullName(name: string): Promise<Personal | null> {
        return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM personal WHERE name = ?', [name], (error: any, results) => {
            if (error) {
              reject(error);
            } else {
              const employees: Personal[] = results as Personal[];
              if (employees.length > 0) {
                resolve(employees[0]);
              } else {
                resolve(null);
              }
            }
          });
        });
      }
}