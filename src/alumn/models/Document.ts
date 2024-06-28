export interface Document {
    document_id: number | null; 
    alumn_id: number | null; 
    certificate: ArrayBuffer;
    created_at: String;
    created_by: string;
    updated_at: String;
    updated_by: string;
    deleted: boolean;
}