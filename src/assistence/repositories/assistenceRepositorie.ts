import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Assistence } from "../models/assitence";

export class AssistenceRepository {

  public static async findAll(): Promise<Assistence[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Assistence', (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const assistence: Assistence[] = results as Assistence[];
          resolve(assistence);
        }
      });
    });
  }

  public static async findById(assistence_id: number): Promise<Assistence | null> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Assistence WHERE assistence_id = ?', [assistence_id], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const assistence: Assistence[] = results as Assistence[];
          if (assistence.length > 0) {
            resolve(assistence[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async createAssistence(assistence: Assistence): Promise<Assistence> {
    const query = 'INSERT INTO Assistence (status,created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?)';
    console.log(assistence);
    return new Promise((resolve, reject) => {
      connection.execute(query, [assistence.status,assistence.created_at, assistence.created_by, assistence.updated_at, assistence.updated_by, assistence.deleted],(error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          const createdAssistenceId = result.insertId;
          const createdAlumn: Assistence = { ...assistence, assitence_id: createdAssistenceId };
          resolve(createdAlumn);
        }
      });
    });
  }

  public static async updateAssistence(assistence_id: number, assistenceData: Assistence): Promise<Assistence | null> {
    const query = 'UPDATE Assistence SET status = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE assistence_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [assistenceData.status, assistenceData.updated_at, assistenceData.updated_by,assistenceData.deleted, assistence_id], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          if (result.affectedRows > 0) {
            const updateAlumn: Assistence = { ...assistenceData, assitence_id: assistence_id };
            resolve(updateAlumn);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async deleteAssistence(assistence_id: number): Promise<boolean> {
    const query = 'DELETE FROM Assistence WHERE assistence_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [assistence_id], (error, result: ResultSetHeader) => {
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