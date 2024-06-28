import { DocumentRepository } from "../repositories/Document";
import { DateUtils } from "../../shared/utils/Date";
import { Document } from "../models/Document";

export class DocumentServices {

    public static async getAllDocuments(): Promise<Document[]> {
        try {
            return await DocumentRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error al obtener documentos: ${error.message}`);
        }
    }

    public static async getDocumentById(documentId: number): Promise<Document | null> {
        try {
            return await DocumentRepository.findById(documentId);
        } catch (error: any) {
            throw new Error(`Error al encontrar documento: ${error.message}`);
        }
    }

    public static async addDocument(document: Document): Promise<Document> {
        try {
            document.created_at = DateUtils.formatDate(new Date());
            document.updated_at = DateUtils.formatDate(new Date());
            return await DocumentRepository.createDocument(document);
        } catch (error: any) {
            throw new Error(`Error al crear documento: ${error.message}`);
        }
    }

    public static async modifyDocument(documentId: number, documentData: Document): Promise<Document | null> {
        try {
            const documentFound = await DocumentRepository.findById(documentId);
            if (documentFound) {
                if (documentData.certificate) {
                    documentFound.certificate = documentData.certificate;
                }
                if (documentData.deleted) {
                    documentFound.deleted = documentData.deleted;
                }
                documentFound.updated_by = documentData.updated_by;
                documentFound.updated_at = DateUtils.formatDate(new Date());
                return await DocumentRepository.updateDocument(documentId, documentFound);
            } else {
                return null;
            }
        } catch (error: any) {
            throw new Error(`Error al modificar documento: ${error.message}`);
        }
    }

    public static async deleteDocument(documentId: number): Promise<boolean> {
        try {
            return await DocumentRepository.deleteDocument(documentId);
        } catch (error: any) {
            throw new Error(`Error al eliminar documento: ${error.message}`);
        }
    }
}
