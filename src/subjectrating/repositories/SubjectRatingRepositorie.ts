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


  public static async createSubjectRating(subjectrating: SubjectRating): Promise<SubjectRating>{
    const ID = [
      {rating_id: 1, subject_id: 2}, // prueba xD
      {rating_id: 1, subject_id: 3} // no jalo xD
    ]
    const query = 'INSERT INTO SubjectRating (rating_id, subject_id) VALUES (?, ?)';
    console.log(subjectrating);
    return new Promise((resolve, reject) => {
      ID.forEach(item => {
       connection.execute(query, [item.rating_id,item.subject_id],(error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          const createSubjectId = result.insertId;
          const createSubject: SubjectRating = { ...subjectrating, subjectrating_id: createSubjectId};
          resolve(createSubject);
        }
      });       
      })


    });
  }

  public static async updateSubjectRating(subjectrating_id: number, subjectData: SubjectRating): Promise<SubjectRating | null> {
    const query = 'UPDATE SubjectRating SET rating_id = ?, subject_id WHERE subjectrating_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [subjectData.all_ids.rating_id, subjectData.all_ids.subject_id,subjectrating_id], (error, result: ResultSetHeader) => {
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