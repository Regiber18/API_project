import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Personal } from "../models/personal";
export class AlumnRepository {

  public static async findAll(): Promise<Personal[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Personal', (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const alumns: Personal[] = results as Personal[];
          resolve(alumns);
        }
      });
    });
  }


  public static async findById(id_personal: number): Promise<Personal | null> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Personal WHERE id_personal = ?', [id_personal], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const alumns: Personal[] = results as Personal[];
          if (alumns.length > 0) {
            resolve(alumns[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }



  public static async findByNamePassword(name: string): Promise<Personal | null> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Personal WHERE name = ?', [name], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const alumns: Personal[] = results as Personal[];
          if (alumns.length > 0) {
            resolve(alumns[0]);
          } else {
            resolve(null);
          }
        }
      });
    });
  }


  public static async createProduct(product: Personal): Promise<Personal> {
    const query = 'INSERT INTO Personal (id_role, name, email, password) VALUES (?, ?, ?, ?)';
    console.log(product);
    return new Promise((resolve, reject) => {
      connection.execute(query,[product.id_role,product.name, product.email, product.password], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          const createdAlumnId = result.insertId;
          const createdAlumn: Personal = { ...product, id_personal: createdAlumnId };
          resolve(createdAlumn);
        }
      });
    });
  }

  public static async updateProduct(id_personal: number, productData: Personal): Promise<Personal | null> {
    const query = 'UPDATE Personal SET name = ?, lastName = ?, password = ? WHERE id_personal = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [productData.name, productData.email, productData.password], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          if (result.affectedRows > 0) {
            const updateAlumn: Personal = { ...productData, id_personal: id_personal };
            resolve(updateAlumn);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async deleteProduct(name: string, lastName: string): Promise<boolean> {
    const query = 'DELETE FROM Personal WHERE name = ? AND lastName = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [name, lastName], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          if (result.affectedRows > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  }

  public static async loginByNameLastName(name: string, lastName: string): Promise<boolean> {
    const query = 'SELECT * FROM Personal WHERE name = ? AND email = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [name, lastName], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error)
        } else {
          if (result.affectedRows > 0) {
            resolve(true)
          }
        }
      })
    })
  }
}