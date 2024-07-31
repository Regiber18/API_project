export interface Personal {
    personal_id: number | null;
    class_id: number | null;
    role_id: number;
    name: string;
    lastName: string;
    password: string;
    url?: string;    
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted: boolean; 
}
