export interface Report {
    report_id: number | null; 
    personal_id: number |null;
    topic: string; 
    created_at: string; 
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted: boolean;
}