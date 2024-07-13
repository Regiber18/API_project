export interface Rating {
    rating_id: number | null;
    ballot_id: number | null;
    amount: number;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted: boolean;
}
