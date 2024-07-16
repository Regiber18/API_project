export interface  Ballot{
    ballot_id: number | null;
    alumn_id: number | null; 
    content: Buffer;
    created_at: string;
    created_by: string;
    updated_at: String;
    updated_by: string;
    deleted: boolean;
}

