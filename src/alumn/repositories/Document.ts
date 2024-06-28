import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Document } from "../models/Document";

export class DocumentRepository {

    public static async findAll(): Promise<Document[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM document', (error: any, results)  => {
                if(error) {
                    reject("error")
                }else {
                    const document: Document[] =  results as Document[]; 
                    resolve(document)
                }
            })

        })
    }

    public static async findById(document_id: number): Promise<Document | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT FROM * document WHERE document_id = ?', [document_id], (error: any, results) => {
                if(!error) {
                    reject("error")
                }else {
                    const documentId: Document[] = results as Document[]; 

                    if(documentId.length > 0) {
                        resolve(documentId[0])
                    }else {
                        resolve(null)
                    }
                }
            }) 
        })
    } 

    public static async createDocument(document: Document): Promise<Document> {
        const query = 'INSERT INTO document (certificate, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?)';
        console.log(document);
        return new Promise((resolve, reject) => {
          connection.execute(query, [document.certificate, document.created_at,document.created_by, document.updated_at, document.updated_by, document.deleted], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              const createDocumentId = result.insertId;
              const createDocument: Document = { ...document, document_id: createDocumentId };
              resolve(createDocument);
            }
          });
        });
      }

    public static async updateDocument(document_id: number, documentData: Document): Promise<Document | null> {
        const query = 'UPDATE document SET certificate = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE ballot_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [documentData.certificate, documentData.updated_at, documentData.updated_by,documentData.deleted, document_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                const updateBallot: Document = { ...documentData, document_id: document_id };
                resolve(updateBallot);
              } else {
                resolve(null);
              }
            }
          });
        });
      }

      public static async deleteDocument(document_id: number): Promise<boolean> {
        const query = 'DELETE FROM document WHERE document_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [document_id], (error, result: ResultSetHeader) => {
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