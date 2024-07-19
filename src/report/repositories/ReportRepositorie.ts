import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Report } from "../models/Report";

export class ReportRepository {

  public static async findAll(): Promise<Report[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Report', (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const reports: Report[] = results as Report[];
          resolve(reports);
        }
      });
    });
  }

  public static async findById(report_id: number): Promise<Report | null> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Report WHERE report_id = ?', [report_id], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const reports: Report[] = results as Report[];
          if (reports.length > 0) {
            resolve(reports[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }


  public static async createReport(report: Report): Promise<Report> {
    const query = 'INSERT INTO Report (personal_id, topic, report_status,created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    console.log(report);
    return new Promise((resolve, reject) => {
      connection.execute(query, [report.personal_id, report.topic, report.report_status,report.created_at, report.created_by, report.updated_at, report.updated_by, report.deleted],(error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          const createRoportId = result.insertId;
          const createReport: Report = { ...report, report_id: createRoportId};
          resolve(createReport);
        }
      });
    });
  }

  public static async updateReport(report_id: number, reportData: Report): Promise<Report | null> {
    const query = 'UPDATE Report SET topic = ?, report_status = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE report_id = ? AND deleted = 0';
    return new Promise((resolve, reject) => {
      connection.execute(query, [reportData.topic, reportData.report_status,reportData.updated_at, reportData.updated_by,reportData.deleted, report_id], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          if (result.affectedRows > 0) {
            const updateReport  = { ...reportData, report_id: report_id };
            resolve(updateReport);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async deleteReport(report_id: number): Promise<boolean> {
    const query = 'DELETE FROM Report WHERE report_id = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [report_id], (error, result: ResultSetHeader) => {
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