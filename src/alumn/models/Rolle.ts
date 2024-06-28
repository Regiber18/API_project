export interface Rolle {
    role_id: number | null; 
    personal_id: number | null; 
    teacher: boolean; 
    management: boolean; 
    escolarControl: boolean; 
    resources: boolean; 
    created_at: String;
    created_by: string;
    updated_at: String;
    updated_by: string;
    deleted: boolean;
}