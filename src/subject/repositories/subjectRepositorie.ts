import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Subject } from "../models/Subject";
import { subjectRating } from "../models/subjectRating";
import { subjectRatingEspañol } from "../models/subjectsRatingEspañol";
import { subjectRatingMath } from "../models/subjectRatingMatematicas";


export class SubjectRepository {

  public static async findAll(): Promise<Subject[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Subject', (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const subjects: Subject[] = results as Subject[];
          resolve(subjects);
        }
      });
    });
  }

  public static async findAllSubjectRating(): Promise<subjectRating[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM SubjectRating', (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const subjects: subjectRating[] = results as subjectRating[];
          resolve(subjects);
        }
      });
    });
  }

  public static async findById(subject_id: number): Promise<Subject | null> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Subject WHERE subject_id = ?', [subject_id], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const subjects: Subject[] = results as Subject[];
          if (subjects.length > 0) {
            resolve(subjects[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }
  //iner de calificaciones por materia

  public static async getSubjectRatingSpanish(): Promise<subjectRatingEspañol[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT r.rating_id, r.amount, r.pertenence, r.gradePertenence, sr.subject_id, s.name AS subject_name FROM Rating r JOIN SubjectRating sr ON r.rating_id = sr.rating_id JOIN Subject s ON sr.subject_id = s.subject_id WHERE r.pertenence = "Spanish" AND s.name = "Spanish"'
        , (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const ratings: subjectRatingEspañol[] = results as subjectRatingEspañol[];
          resolve(ratings);
        }
      });
    });
  }

  public static async getSubjectRatingMath(): Promise<subjectRatingMath[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT r.rating_id, r.amount, r.pertenence, r.gradePertenence, sr.subject_id, s.name AS subject_name FROM Rating r JOIN SubjectRating sr ON r.rating_id = sr.rating_id JOIN Subject s ON sr.subject_id = s.subject_id WHERE r.pertenence = "Math" AND r.deleted = 0 AND s.name = "Math"'
        , (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const ratings: subjectRatingMath[] = results as subjectRatingMath[];
          resolve(ratings);
        }
      });
    });
  }

  public static async getSubjectRatingCience(): Promise<subjectRatingMath[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT r.rating_id, r.amount, r.pertenence, r.gradePertenence, sr.subject_id, s.name AS subject_name FROM Rating r JOIN SubjectRating sr ON r.rating_id = sr.rating_id JOIN Subject s ON sr.subject_id = s.subject_id WHERE r.pertenence = "Cience" AND r.deleted = 0 AND s.name = "Cience"'
        , (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const ratings: subjectRatingMath[] = results as subjectRatingMath[];
          resolve(ratings);
        }
      });
    });
  }

  public static async createSubject(subject: Subject): Promise<Subject> {
    const query = 'INSERT INTO Subject (name, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?)';
    console.log(subject);
    return new Promise((resolve, reject) => {
      connection.execute(query, [subject.name, subject.created_at, subject.created_by, subject.updated_at, subject.updated_by, subject.deleted],(error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          const createSubjectId = result.insertId;
          const createSubject: Subject = { ...subject, subject_id: createSubjectId};
          resolve(createSubject);

           return this.createSubject;
        }
      });
    });
  }

  public static async updateSubject(subject_id: number, subjectData: Subject): Promise<Subject | null> {
    const query = 'UPDATE Subject SET name = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE subject_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [subjectData.name, subjectData.updated_at, subjectData.updated_by,subjectData.deleted, subject_id], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          if (result.affectedRows > 0) {
            const updateSubject = { ...subjectData, subject_id: subject_id };
            resolve(updateSubject);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async deleteSubject(subject_id: number): Promise<boolean> {
    const query = 'DELETE FROM Subject WHERE subject_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [subject_id], (error, result: ResultSetHeader) => {
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