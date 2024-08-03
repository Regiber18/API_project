import { AlumnData } from "./AlumnData";

export interface Personal {
    personal_id: number | null;
    class_id: number | null;
    role_id: number;
    name: string;
    lastName: string;
    password: string;
    alumns: AlumnData[] //no está bien
    url?: string[];    
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted: boolean; 
}
