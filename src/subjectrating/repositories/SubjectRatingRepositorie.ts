import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { SubjectRating } from "../models/SubjectRating";

export class SubjectRepository {

  public static async findAll(): Promise<SubjectRating[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM SubjectRating', (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const subjects: SubjectRating[] = results as SubjectRating[];
          resolve(subjects);
        }
      });
    });
  }

  public static async findById(subjectrating_id: number): Promise<SubjectRating | null> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM SubjectRating WHERE subjectrating_id = ?', [subjectrating_id], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const subjects: SubjectRating[] = results as SubjectRating[];
          if (subjects.length > 0) {
            resolve(subjects[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async createSubjectRating(subjectrating: SubjectRating): Promise<SubjectRating> {
    const query = 'INSERT INTO SubjectRating (subject_id, rating_id) VALUES (?, ?)';
    console.log(subjectrating);
    return new Promise((resolve, reject) => {
      connection.execute(query, [subjectrating.all_ids, subjectrating.all_ids],(error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          const createSubjectId = result.insertId;
          const createSubject: SubjectRating = { ...subjectrating, subjectrating_id: createSubjectId};
          resolve(createSubject);
        }
      });
    });
  }

  public static async updateSubjectRating(subjectrating_id: number, subjectData: SubjectRating): Promise<SubjectRating | null> {
    const query = 'UPDATE SubjectRating SET subject_id = ?, rating_id WHERE subjectrating_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [subjectData.all_ids, subjectData.all_ids,subjectrating_id], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          if (result.affectedRows > 0) {
            const updateSubject = { ...subjectData, subjectrating_id: subjectrating_id };
            resolve(updateSubject);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async deleteSubject(subjectrating_id: number): Promise<boolean> {
    const query = 'DELETE FROM SubjectRating WHERE subjectrating_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [subjectrating_id], (error, result: ResultSetHeader) => {
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