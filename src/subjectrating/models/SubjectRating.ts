export interface SubjectRating {
    subjectrating_id: number | null;
    all_ids : {
        subject_id: number | null,
        rating_id: number | null       
    }
}