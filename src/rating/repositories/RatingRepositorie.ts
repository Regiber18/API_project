import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Rating } from "../models/Rating";
import { subjectRating } from "../../subject/models/subjectRating";
import { AmountSpanish } from "../models/AmountSpanish";

export class RatingRepository {

    public static async findAll(): Promise<Rating[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Rating', (error: any, results: any) => {
                if (error) {
                    reject(new Error("Error fetching all rating"));
                } else {
                    const ballots: Rating[] = results as Rating[];
                    resolve(ballots);
                }
            });
        });
    }

    public static async findRatingId(): Promise<Rating[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT rating_id FROM Rating', (error: any, results: any) => {
                if (error) {
                    reject(new Error("Error fetching all rating"));
                } else {
                    const ballots: Rating[] = results as Rating[];
                    resolve(ballots);
                }
            });
        });
    }

    public static async findAmountRating(): Promise<Rating[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT amount FROM Rating', (error: any, results: any) => {
                if (error) {
                    reject(new Error("Error fetching all rating"));
                } else {
                    const ballots: Rating[] = results as Rating[];
                    resolve(ballots);
                }
            });
        });
    }

    public static async findById(rating_id: number): Promise<Rating | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Rating WHERE rating_id = ?', [rating_id], (error: any, results: any) => {
                if (error) {
                    reject(new Error("Error fetching ballot by ID"));
                } else {
                    const ballotsId: Rating[] = results as Rating[];
                    if (ballotsId.length > 0) {
                        resolve(ballotsId[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    public static async findSR(): Promise<subjectRating[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM SubjectRating', (error: any, results: any) => {
                if (error) {
                    reject(new Error("Error fetching all rating"));
                } else {
                    const sr: subjectRating[] = results as subjectRating[];
                    resolve(sr);
                }
            });
        });
    }

    public static async getDataSpanish(): Promise<AmountSpanish[]> {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT r.amount  FROM Rating r JOIN SubjectRating sr ON r.rating_id = sr.rating_id JOIN Subject s ON sr.subject_id = s.subject_id WHERE r.pertenence = "Spanish" AND r.deleted = 0 AND s.name = "Spanish"',
                (error: any, results: any) => {
                    if (error) {
                        reject(new Error("Error fetching subject ID for 'Spanish': " + error.message));
                    } else {
                        if (results.length === 0) {
                            reject(new Error("No subject found with name 'Spanish'"));
                        } else {
                            const ballots: AmountSpanish[] = results as AmountSpanish[];
                            resolve(ballots);
                        }
                    }
                }
            );
        });  
    }

    public static async getIDSUbjectSpanish(): Promise<number> {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT subject_id FROM Subject WHERE name = "Spanish" AND deleted = FALSE',
                (error: any, results: any) => {
                    if (error) {
                        reject(new Error("Error fetching subject ID for 'Spanish': " + error.message));
                    } else {
                        if (results.length === 0) {
                            reject(new Error("No subject found with name 'Spanish'"));
                        } else {
                            const subject_id = (results as any)[0].subject_id;
                            resolve(subject_id);
                        }
                    }
                }
            );
        });
    }

    public static async getIDSUbjectMath(): Promise<number> {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT subject_id FROM Subject WHERE name = "Math" AND deleted = FALSE',
                (error: any, results: any) => {
                    if (error) {
                        reject(new Error("Error fetching subject ID for 'Math': " + error.message));
                    } else {
                        if (results.length === 0) {
                            reject(new Error("No subject found with name 'Math'"));
                        } else {
                            const subject_id = (results as any)[0].subject_id;
                            resolve(subject_id);
                        }
                    }
                }
            );
        });
    }

    public static async getIDSUbjectCience(): Promise<number> {
        return new Promise((resolve, reject) => {
            connection.query(
                'SELECT subject_id FROM Subject WHERE name = "Science" AND deleted = FALSE',
                (error: any, results: any) => {
                    if (error) {
                        reject(new Error("Error fetching subject ID for 'Science': " + error.message));
                    } else {
                        if (results.length === 0) {
                            reject(new Error("No subject found with name 'Science'"));
                        } else {
                            const subject_id = (results as any)[0].subject_id;
                            resolve(subject_id);
                        }
                    }
                }
            );
        });
    }
    


    public static async createRating(rating: Rating): Promise<Rating> {
        const query = 'INSERT INTO Rating (alumn_id, amount, pertenence, gradePertenence, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            connection.execute(query, [ rating.alumn_id,rating.amount,rating.pertenence, rating.gradePertenence,rating.created_at, rating.created_by, rating.updated_at, rating.updated_by, rating.deleted], (error: any, result: ResultSetHeader) => {
                if (error) {
                    reject(new Error("Error creating ballot"));
                } else {
                    const createdRatingId = result.insertId;
                    const createdRating: Rating = { ...rating, rating_id: createdRatingId };
                    resolve(createdRating);
                }
            });
        });
    }


    public static async createsubjectRating(subject_id: number, rating_id: number): Promise<subjectRating> {
        const query = 'INSERT INTO SubjectRating (subject_id, rating_id) VALUES (?, ?)';
        
        return new Promise((resolve, reject) => {
            connection.execute(query, [subject_id, rating_id], (error) => {
                if (error) {
                    reject(error);
                } else {
                    const createSubjectRating: subjectRating = { subject_id, rating_id };
                    resolve(createSubjectRating);
                }
            });
        });
    }

  

    public static async updateRating(rating_id: number, ballotRating: Rating): Promise<Rating | null> {
        const query = 'UPDATE Rating SET alumn_id = ?, amount = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE rating_id = ? AND deleted = 0';
        return new Promise((resolve, reject) => {
            connection.execute(query, [ballotRating.alumn_id ,ballotRating.amount, ballotRating.updated_at, ballotRating.updated_by, ballotRating.deleted, rating_id], (error: any, result: ResultSetHeader) => {
                if (error) {
                    reject(new Error("Error updating ballot"));
                } else {
                    if (result.affectedRows > 0) {
                        const updatedRating: Rating = { ...ballotRating, rating_id: rating_id };
                        resolve(updatedRating);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    public static async deleteRating(rating_id: number): Promise<boolean> {
        const query = 'DELETE FROM Rating WHERE rating_id = ?';
        return new Promise((resolve, reject) => {
            connection.execute(query, [rating_id], (error: any, result: ResultSetHeader) => {
                if (error) {
                    reject(new Error("Error deleting ballot"));
                } else {
                    if (result.affectedRows > 0) {
                        resolve(true); // Successful deletion
                    } else {
                        resolve(false); // Ballot not found for deletion
                    }
                }
            });
        });
    }
}
