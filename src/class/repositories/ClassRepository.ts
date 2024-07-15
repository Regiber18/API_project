import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Class } from "../models/Class";

export class GroupRepository {

    public static async findAll(): Promise<Class[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Class', (error: any, results: any[])  => {
                if(error) {
                    reject(error); // Manejar error correctamente
                } else {
                    const classes: Class[] = results as Class[]; // Convertir resultados a objetos Class
                    resolve(classes); // Resolver con los datos obtenidos
                }
            });
        });
    }

    public static async findById(class_id: number): Promise<Class | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Class WHERE class_id = ?', [class_id], (error: any, results: any[]) => {
                if(error) {
                    reject(error); // Manejar error correctamente
                } else {
                    const foundClass: Class[] = results as Class[];
                    if(foundClass.length > 0) {
                         // Obtener el primer resultado como objeto Class
                        resolve(foundClass[0]);
                    } else {
                        resolve(null); // Resolver con null si no se encontró ningún resultado
                    }
                }
            });
        });
    }

    public static async createClass(clas: Class): Promise<Class> {
        const query = 'INSERT INTO Class (personal_id, className, classGrade, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            connection.execute(query, [clas.personal_id, clas.className, clas.classGrade, clas.created_at, clas.created_by, clas.updated_at, clas.updated_by, clas.deleted], (error, result: ResultSetHeader) => {
                if (error) {
                    reject(error); // Manejar error correctamente
                } else {
                    const createClassId = result.insertId;
                    const createdClass: Class = { ...clas, class_id: createClassId }; // Construir objeto Class creado
                    resolve(createdClass); // Resolver con el objeto Class creado
                }
            });
        });
    }

    public static async updateClass(class_id: number, classData: Class): Promise<Class | null> {
        const query = 'UPDATE Class SET className = ?, classGrade = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE class_id = ?';
        return new Promise((resolve, reject) => {
            connection.execute(query, [classData.className, classData.classGrade, classData.updated_at, classData.updated_by, classData.deleted, class_id], (error, result: ResultSetHeader) => {
                if (error) {
                    reject(error); // Manejar error correctamente
                } else {
                    if (result.affectedRows > 0) {
                        const updatedClass: Class = { ...classData, class_id: class_id }; // Construir objeto Class actualizado
                        resolve(updatedClass); // Resolver con el objeto Class actualizado
                    } else {
                        resolve(null); // Resolver con null si no se actualizó ningún registro
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
                    reject(error); // Manejar error correctamente
                } else {
                    if (result.affectedRows > 0) {
                        resolve(true); // Eliminación exitosa
                    } else {
                        resolve(false); // Resolver false si no se encontró el registro a eliminar
                    }
                }
            });
        });
    }
}
