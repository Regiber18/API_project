import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Alumns } from "../models/Alumns";

export class AlumnRepository {

  public static async findAll(): Promise<Alumns[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Alumn', (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const alumns: Alumns[] = results as Alumns[];
          resolve(alumns);
        }
      });
    });
  }

  public static async findById(alumn_id: number): Promise<Alumns | null> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Alumn WHERE alumn_id = ?', [alumn_id], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const alumns: Alumns[] = results as Alumns[];
          if (alumns.length > 0) {
            resolve(alumns[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async createAlumn(alumn: Alumns): Promise<Alumns> {
    const query = 'INSERT INTO Alumn (name, age, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)';
    console.log(alumn);
    return new Promise((resolve, reject) => {
      connection.execute(query, [alumn.name,alumn.age, alumn.created_at, alumn.created_by, alumn.updated_at, alumn.updated_by, alumn.deleted],(error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          const createdAlumnId = result.insertId;
          const createdAlumn: Alumns = { ...alumn, alumn_id: createdAlumnId };
          resolve(createdAlumn);
        }
      });
    });
  }

  public static async updateAlumn(alumn_id: number, alumnData: Alumns): Promise<Alumns | null> {
    const query = 'UPDATE Alumn SET name = ?, age = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE alumn_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [alumnData.name, alumnData.age, alumnData.updated_at, alumnData.updated_by,alumnData.deleted, alumn_id], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          if (result.affectedRows > 0) {
            const updateAlumn: Alumns = { ...alumnData, alumn_id: alumn_id };
            resolve(updateAlumn);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async deleteAlumn(alumn_id: number): Promise<boolean> {
    const query = 'DELETE FROM Alumn WHERE alumn_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [alumn_id], (error, result: ResultSetHeader) => {
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