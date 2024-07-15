import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Rating } from "../models/Rating";

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

    public static async createBallot(rating: Rating): Promise<Rating> {
        const query = 'INSERT INTO Rating (ballot_id, amount, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            connection.execute(query, [rating.ballot_id, rating.amount, rating.created_at, rating.created_by, rating.updated_at, rating.updated_by, rating.deleted], (error: any, result: ResultSetHeader) => {
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

    public static async updateBallot(rating_id: number, ballotRating: Rating): Promise<Rating | null> {
        const query = 'UPDATE Rating SET amount = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE rating_id = ?';
        return new Promise((resolve, reject) => {
            connection.execute(query, [ballotRating.amount, ballotRating.updated_at, ballotRating.updated_by, ballotRating.deleted, rating_id], (error: any, result: ResultSetHeader) => {
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

    public static async deleteBallot(rating_id: number): Promise<boolean> {
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
