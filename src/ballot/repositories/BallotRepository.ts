import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Ballot } from "../models/Ballot";

export class BallotRepository {

    public static async findAll(): Promise<Ballot[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Ballot', (error: any, results: any) => {
                if (error) {
                    reject(new Error("Error fetching all ballots"));
                } else {
                    const ballots: Ballot[] = results as Ballot[];
                    resolve(ballots);
                }
            });
        });
    }

    public static async findById(ballot_id: number): Promise<Ballot | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Ballot WHERE ballot_id = ?', [ballot_id], (error: any, results: any) => {
                if (error) {
                    reject(new Error("Error fetching ballot by ID"));
                } else {
                    const ballotsId: Ballot[] = results as Ballot[];
                    if (ballotsId.length > 0) {
                        resolve(ballotsId[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    public static async createBallot(ballot: Ballot): Promise<Ballot> {
        const query = 'INSERT INTO Ballot (alumn_id, content, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            connection.execute(query, [ballot.alum_id, ballot.content, ballot.created_at, ballot.created_by, ballot.updated_at, ballot.updated_by, ballot.deleted], (error: any, result: ResultSetHeader) => {
                if (error) {
                    reject(new Error("Error creating ballot"));
                } else {
                    const createdBallotId = result.insertId;
                    const createdBallot: Ballot = { ...ballot, ballot_id: createdBallotId };
                    resolve(createdBallot);
                }
            });
        });
    }

    public static async updateBallot(ballot_id: number, ballotData: Ballot): Promise<Ballot | null> {
        const query = 'UPDATE Ballot SET content = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE ballot_id = ?';
        return new Promise((resolve, reject) => {
            connection.execute(query, [ballotData.content, ballotData.updated_at, ballotData.updated_by, ballotData.deleted, ballot_id], (error: any, result: ResultSetHeader) => {
                if (error) {
                    reject(new Error("Error updating ballot"));
                } else {
                    if (result.affectedRows > 0) {
                        const updatedBallot: Ballot = { ...ballotData, ballot_id: ballot_id };
                        resolve(updatedBallot);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    public static async deleteBallot(ballot_id: number): Promise<boolean> {
        const query = 'DELETE FROM Ballot WHERE ballot_id = ?';
        return new Promise((resolve, reject) => {
            connection.execute(query, [ballot_id], (error: any, result: ResultSetHeader) => {
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
