import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Group } from "../models/Group";

export class GroupRepository {

    public static async findAll(): Promise<Group[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM only_group', (error: any, results)  => {
                if(error) {
                    reject("error")
                }else {
                    const group: Group[] =  results as Group[]; 
                    resolve(group)
                }
            })

        })
    }

    public static async findById(group_id: number): Promise<Group | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM only_group WHERE group_id = ?', [group_id], (error: any, results) => {
                if(!error) {
                    reject("error")
                }else {
                    const groupId: Group[] = results as Group[]; 

                    if(groupId.length > 0) {
                        resolve(groupId[0])
                    }else {
                        resolve(null)
                    }
                }
            }) 
        })
    } 

    public static async createGroup(group: Group): Promise<Group> {
        const query = 'INSERT INTO only_group (name, grade ,created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)';
        console.log(group);
        return new Promise((resolve, reject) => {
          connection.execute(query, [group.name,group.grade,group.created_at,group.created_by, group.updated_at, group.updated_by, group.deleted], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              const createGroupId = result.insertId;
              const createGroup: Group = { ...group, group_id: createGroupId };
              resolve(createGroup);
            }
          });
        });
      }

    public static async updateGroup(group_id: number, groupData: Group): Promise<Group | null> {
        const query = 'UPDATE only_group SET name = ?, grade = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE group_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [groupData.name, groupData.grade, groupData.updated_at, groupData.updated_by,groupData.deleted, group_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                const updateGroup: Group = { ...groupData, group_id: group_id };
                resolve(updateGroup);
              } else {
                resolve(null);
              }
            }
          });
        });
      }

      public static async deleteGroup(group_id: number): Promise<boolean> {
        const query = 'DELETE FROM only_group WHERE group_id = ?';
        return new Promise((resolve, reject) => {
          connection.execute(query, [group_id], (error, result: ResultSetHeader) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                resolve(true); // Eliminación exitosa
              } else {
                resolve(false); // Si no se encontró el usuario a eliminar
              }
            }
          });
        });
      }
}