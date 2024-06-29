import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Class } from "../models/Class";

export class GroupRepository {

    public static async findAll(): Promise<Class[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Class', (error: any, results)  => {
                if(error) {
                    reject("error")
                }else {
                    const group: Class[] =  results as Class[]; 
                    resolve(group)
                }
            })

        })
    }

    public static async findById(class_id: number): Promise<Class | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Class WHERE class_id = ?', [class_id], (error: any, results) => {
                if(!error) {
                    reject("error")
                }else {
                    const classID: Class[] = results as Class[]; 

                    if(classID.length > 0) {
                        resolve(classID[0])
                    }else {
                        resolve(null)
                    }
                }
            }) 
        })
    } 

    public static async createClass(clas: Class): Promise<Class> {
        const query = 'INSERT INTO Class (name, grade ,created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)';
        console.log(clas);
        return new Promise((resolve, reject) => {
          connection.execute(query, [clas.name,clas.grade,clas.created_at,clas.created_by, clas.updated_at, clas.updated_by, clas.deleted], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              const createClassId = result.insertId;
              const createClass: Class = { ...clas, class_id: createClassId };
              resolve(createClass);
            }
          });
        });
      }

    public static async updateClass(class_id: number,classData: Class): Promise<Class | null> {
        const query = 'UPDATE Class SET name = ?, grade = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE class_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [classData.name, classData.grade, classData.updated_at, classData.updated_by,classData.deleted, class_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                const updateClass: Class = { ...classData, class_id: class_id };
                resolve(updateClass);
              } else {
                resolve(null);
              }
            }
          });
        });
      }

      public static async deleteClass(class_id: number): Promise<boolean> {
        const query = 'DELETE FROM Class WHERE class_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [class_id], (error, result: ResultSetHeader) => {
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