import { ResultSetHeader } from "mysql2";
import connection from "../../shared/config/database";
import { Product } from "../models/product";
import { ProductUpdate } from "../models/ProductUpdate";
import { EventPerson } from "../../personal/models/EventPerson";
import { RowDataPacket } from "mysql2";
import { eventAll } from "../models/eventAll";
import { eventAllWith } from "../models/eventAllWith";
import { event } from "../models/event";
import { status } from "../models/status";

export class AlumnRepository {

  public static async findAll(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM event', (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const alumns: Product[] = results as Product[];
          resolve(alumns);
        }
      });
    });
  }

  public static async findAllStatus(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT p.name, e.game, e.type_game, e.amount, e.status, e.id_personal, e.id_event FROM personal as p LEFT JOIN event as e ON  p.id_personal WHERE  p.id_personal = e.id_personal AND status = "finalizado"', (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const alumns: Product[] = results as Product[];
          resolve(alumns);
        }
      });
    });
  }

  public static async getAll(): Promise<{ event: any; participantCount: number }[]> {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
      p.name, 
      e.game, 
      e.type_game, 
      e.amount, 
      e.status, 
      e.id_personal, 
      e.id_event, 
      COUNT(ep.id_personal) AS participant_count
    FROM 
      personal AS p 
    LEFT JOIN 
      event AS e ON p.id_personal = e.id_personal 
    LEFT JOIN 
      eventperson AS ep ON e.id_event = ep.id_event 
    WHERE e.game != ''
    AND e.status = 'espera'
    GROUP BY 
      e.id_event, p.id_personal
      `;

      connection.query(query, (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const resultQuery: any[] = results as [];
          const eventsWithCounts = resultQuery.map((row: any) => ({
            event: {
              name: row.name,
              game: row.game,
              type_game: row.type_game,
              amount: row.amount,
              status: row.status,
              id_personal: row.id_personal,
              id_event: row.id_event
            },
            participantCount: row.participant_count || 0 // Default to 0 if no participants
          }));
          console.log(eventsWithCounts)
          resolve(eventsWithCounts);
        }
      });
    });
  }

  public static async getAllWithStatus(): Promise<{ event: any; participantCount: number }[]> {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
      p.name, 
      e.game, 
      e.type_game, 
      e.amount, 
      e.status, 
      e.id_personal, 
      e.id_event, 
      COUNT(ep.id_personal) AS participant_count
    FROM 
      personal AS p 
    LEFT JOIN 
      event AS e ON p.id_personal = e.id_personal 
    LEFT JOIN 
      eventperson AS ep ON e.id_event = ep.id_event 
    WHERE e.game != ''
    GROUP BY 
      e.id_event, p.id_personal
      `;

      connection.query(query, (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const resultQuery: any[] = results as [];
          const eventsWithCounts = resultQuery.map((row: any) => ({
            event: {
              name: row.name,
              game: row.game,
              type_game: row.type_game,
              amount: row.amount,
              status: row.status,
              id_personal: row.id_personal,
              id_event: row.id_event
            },
            participantCount: row.participant_count || 0 // Default to 0 if no participants
          }));
          console.log(eventsWithCounts)
          resolve(eventsWithCounts);
        }
      });
    });
  }




  public static async findByIdProduct(name?: string, type?: string): Promise<ProductUpdate | null> {
    return new Promise((resolve, reject) => {
      // Start constructing the query
      let query = 'SELECT * FROM event WHERE 1=1';
      const params: (string | null)[] = [];

      // Check if name is provided
      if (name) {
        console.log("Searching for game:", name);
        query += ' AND game = ?';
        params.push(name);
      }

      // Check if type is provided
      if (type) {
        console.log("Searching for type game:", type);
        query += ' AND type_game = ?';
        params.push(type);
      }

      // If neither is provided, return null
      if (params.length === 0) {
        console.log("No parameters provided for search.");
        resolve(null);
        return;
      }

      console.log("Final query:", query);
      console.log("Query parameters:", params);

      connection.query(query, params, (error: any, results) => {
        if (error) {
          console.error("Error in the query:", error);
          reject(error);
        } else {
          const products: ProductUpdate[] = results as ProductUpdate[];
          if (products.length > 0) {
            console.log("cero")
            resolve(products[0]); // Return the first found product
          } else {
            console.log("No products found.");
            resolve(null); // Return null if no results are found
          }
        }
      });
    });
  }



  public static async updateStock(productData: ProductUpdate): Promise<ProductUpdate | null> {
    const query = 'UPDATE Product SET amount = amount - ? WHERE id_event = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [productData.amount, productData.id_product], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          if (result.affectedRows > 0) {
            resolve({ ...productData, id_product: productData.id_product });
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async addPersonToEvent(eventPerson: EventPerson): Promise<EventPerson | null> {
    const participantCountQuery = 'SELECT COUNT(*) as count FROM eventerson WHERE id_event = ?';
    const eventQuery = 'SELECT amount FROM event WHERE id_event = ?';

    return new Promise(async (resolve, reject) => {
      try {
        // Obtener el límite de participantes del evento
        const [eventResult] = await new Promise<RowDataPacket[]>((resolve, reject) => {
          connection.query(eventQuery, [eventPerson.id_event], (error, results: RowDataPacket[]) => {
            if (error) reject(error);
            else resolve(results);
          });
        });

        // Verificar si el evento existe
        if (!eventResult || eventResult.length === 0) {
          return resolve(null); // O puedes rechazar con un error si prefieres
        }

        const eventAmount = eventResult.amount; // Acceso seguro
        if (eventAmount === undefined) {
          console.error("Event amount is undefined.");
          return resolve(null);
        }

        // Obtener el número actual de participantes
        const [participantCountResult] = await new Promise<RowDataPacket[]>((resolve, reject) => {
          connection.query(participantCountQuery, [eventPerson.id_event], (error, results: RowDataPacket[]) => {
            if (error) reject(error);
            else resolve(results);
          });
        });

        // Verificar si se encontró el conteo de participantes
        if (!participantCountResult || participantCountResult.length === 0) {
          return resolve(null); // O puedes rechazar con un error si prefieres
        }

        const participantCount = participantCountResult.count; // Acceso seguro

        // Permitir agregar participantes si no se ha alcanzado el máximo
        if (participantCount < eventAmount) {
          const insertQuery = 'INSERT INTO eventperson (id_personal, id_event) VALUES (?, ?)';
          connection.execute(insertQuery, [eventPerson.id_personal, eventPerson.id_event], (error: any) => {
            if (error) {
              reject(error);
            } else {
              const createdEventPerson: EventPerson = { ...eventPerson };
              resolve(createdEventPerson);
            }
          });
        } else {
          console.log("No more space for additional participants");
          resolve(null); // No hay espacio suficiente para más participantes
        }
      } catch (error) {
        console.error("Error in createEventPerson:", error);
        reject(error);
      }
    });
  }



  public static async restPersonToEvent(eventPerson: EventPerson): Promise<EventPerson | null> {
    const participantCountQuery = 'SELECT COUNT(*) as count FROM eventperson WHERE id_event = ?';

    return new Promise(async (resolve, reject) => {
      try {
        const [participantCountResult] = await new Promise<RowDataPacket[]>((resolve, reject) => {
          connection.query(participantCountQuery, [eventPerson.id_event], (error, results: RowDataPacket[]) => {
            if (error) reject(error);
            else resolve(results);
          });
        });

        // Log participant count result for debugging
        console.log('Participant Count Result:', participantCountResult);

        // Check if the participantCountResult is valid
        if (!participantCountResult || participantCountResult.length === 0) {
          return reject(new Error("No participant count found for the event."));
        }

        const participantCount = participantCountResult.count; // Use optional chaining
        if (participantCount === undefined) {
          console.error("Participant count is undefined.");
          return reject(new Error("Participant count not found."));
        }

        // Allow adding participants if we haven't reached the maximum
        if (participantCount > 0) {
          console.log(eventPerson.id_event)
          const insertQuery = 'DELETE FROM eventperson WHERE id_personal = ? AND id_event = ?';
          connection.execute(insertQuery, [eventPerson.id_personal, eventPerson.id_event], (error: any) => {
            if (error) {
              reject(error);

            } else {
              resolve(eventPerson);

              // Return the newly created EventPerson object
            }
          });
        } else {
          resolve(null); // Not enough space for additional participants

        }
      } catch (error) {
        reject(error);
        console.log("eeee")
      }
    });
  }

  public static async finMyEventsIn(id_personal: number): Promise<eventAllWith[] | null> {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT e.*, p.name FROM event AS e JOIN eventperson AS ep JOIN personal AS p ON e.id_event = ep.id_event WHERE ep.id_personal = ? AND e.id_personal = p.id_personal',
        [id_personal], (error: any, results) => {
          if (error) {
            console.error("Error en la consulta:", error);
            reject(error);
          } else {
            console.log(results)
            const events: eventAllWith[] = results as eventAllWith[];
            resolve(events.length > 0 ? events : null); // Devuelve todos los eventos o null
          }
        }
      );
    });
  }

  public static async finByName(name: string): Promise<event[] | null> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM event WHERE game = ?', [name], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const alumns: event[] = results as event[];
          if (alumns.length > 0) {
            resolve(alumns);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  public static async findByNameAll(game?: string): Promise<{ event: eventAll; participantCount: number }[]> {
    return new Promise((resolve, reject) => {
      // Base query
      let query = `
        SELECT 
          p.name, 
          e.game, 
          e.type_game, 
          e.amount, 
          e.status, 
          e.id_personal, 
          e.id_event, 
          COUNT(ep.id_personal) AS participant_count
        FROM 
          personal AS p 
        LEFT JOIN 
          event AS e ON p.id_personal = e.id_personal 
        LEFT JOIN 
          eventperson AS ep ON e.id_event = ep.id_event 
        WHERE 
          e.game != ''
        AND e.status = 'espera'
      `;
  
      // Add filtering by game if provided
      if (game) {
        query += ` AND e.game = ?`;
      }
  
      query += ` GROUP BY e.id_event, p.id_personal`;
  
      // Execute the query
      connection.query(query, game ? [game] : [], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const resultQuery: any[] = results as [];
          const eventsWithCounts = resultQuery.map((row: any) => ({
            event: {
              name: row.name,
              game: row.game,
              type_game: row.type_game,
              amount: row.amount,
              status: row.status,
              id_personal: row.id_personal,
              id_event: row.id_event
            },
            participantCount: row.participant_count || 0 // Default to 0 if no participants
          }));
  
          resolve(eventsWithCounts);
        }
      });
    });
  }

  public static async findByNameAllType(type_game?: string): Promise<{ event: eventAll; participantCount: number }[]> {
    return new Promise((resolve, reject) => {
      // Base query
      let query = `
        SELECT 
          p.name, 
          e.game, 
          e.type_game, 
          e.amount, 
          e.status, 
          e.id_personal, 
          e.id_event, 
          COUNT(ep.id_personal) AS participant_count
        FROM 
          personal AS p 
        LEFT JOIN 
          event AS e ON p.id_personal = e.id_personal 
        LEFT JOIN 
          eventperson AS ep ON e.id_event = ep.id_event 
        WHERE 
          e.game != ''
        AND e.status = 'espera'
      `;
  
      // Add filtering by game if provided
      if (type_game) {
        query += ` AND e.type_game = ?`;
      }
  
      query += ` GROUP BY e.id_event, p.id_personal`;
  
      // Execute the query
      connection.query(query, type_game ? [type_game] : [], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const resultQuery: any[] = results as [];
          const eventsWithCounts = resultQuery.map((row: any) => ({
            event: {
              name: row.name,
              game: row.game,
              type_game: row.type_game,
              amount: row.amount,
              status: row.status,
              id_personal: row.id_personal,
              id_event: row.id_event
            },
            participantCount: row.participant_count || 0 // Default to 0 if no participants
          }));
  
          resolve(eventsWithCounts);
        }
      });
    });
  }
  

  public static async findByTypeGame(type_game: string): Promise<event[] | null> {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM event WHERE type_game = ?', [type_game], (error: any, results) => {
        if (error) {
          reject(error);
        } else {
          const alumns: event[] = results as event[];
          if (alumns.length > 0) {
            resolve(alumns);
          } else {
            resolve(null);
          }
        }
      });
    });
  }



  public static async createProduct(product: Product): Promise<Product> {
    const query = 'INSERT INTO event (status, game, type_game, description, date, id_personal, amount) VALUES (?, ?, ?, ?, ?, ?, ?)';
    console.log(product);
    return new Promise((resolve, reject) => {
      connection.execute(query, [product.status, product.game, product.type_game, product.description, product.date, product.id_personal, product.amount], (error, result: ResultSetHeader) => {
        if (error) {
          reject(error);
        } else {
          const createdAlumnId = result.insertId;
          const createdAlumn: Product = { ...product, id_event: createdAlumnId };
          resolve(createdAlumn);
        }
      });
    });
  }

  public static async createEventPerson(eventPerson: EventPerson): Promise<EventPerson> {
    const query = 'INSERT INTO eventperson (id_personal, id_event) VALUES (?, ?)';
    return new Promise((resolve, reject) => {
      connection.execute(query, [eventPerson.id_personal, eventPerson.id_event], (error) => {
        if (error) {
          reject(error);
        } else {
          const createdEventPerson: EventPerson = { ...eventPerson }; // Puedes agregar id_event_personal si es necesario
          resolve(createdEventPerson);
        }
      });
    });
  }

  public static async updateProduct(game: string, status: status): Promise<status | null> {
    const query = 'UPDATE event SET status = ? WHERE game = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [status.status, game], (error, result: ResultSetHeader) => {
        if (error) {
          console.log(error)
          reject(error);
        } else {
          if (result.affectedRows > 0) {
            console.log(result)
            const results: status = { ...status }
            resolve(results);
          } else {
            console.log("error")
            resolve(null);
          }
        }
      });
    });
  }

  public static async deleteProduct(name: string): Promise<boolean> {
    const query = 'DELETE FROM event WHERE game = ?';
    return new Promise((resolve, reject) => {
      connection.execute(query, [name], (error, result: ResultSetHeader) => {
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


  public static async deleteEventI(id_personal: number, id_event: number): Promise<boolean> {
    const query = 'DELETE ep FROM event AS e JOIN eventperson AS ep ON e.id_event = ep.id_event JOIN personal AS p ON e.id_personal = p.id_personal WHERE ep.id_personal = ? AND ep.id_event = ? AND e.status = "espera"';
    return new Promise((resolve, reject) => {
      connection.execute(query, [id_personal, id_event], (error, result: ResultSetHeader) => {
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
}