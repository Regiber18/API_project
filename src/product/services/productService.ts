import { AlumnRepository } from "../repositories/productRepository";
import { Product } from "../models/product";
import { EventPerson } from "../../personal/models/EventPerson";
import { status } from "../models/status";



export class productService {

    public static async getAllProducts(): Promise<Product[]> {
        try {
            return await AlumnRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    public static async getAllEventsStatus(): Promise<Product[]> {
        try {
            return await AlumnRepository.findAllStatus();
        } catch (error: any) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }


    public static async getAllEventsWith(): Promise<any[]> {
        try {
            return await AlumnRepository.getAll();
        } catch (error: any) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }
    public static async getAllEventsWithStatus(): Promise<any[]> {
        try {
            return await AlumnRepository.getAllWithStatus();
        } catch (error: any) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }


    public static async addAlumn(product: Product) {
        try {
            return await AlumnRepository.createProduct(product);
        } catch (error: any) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    public static async addEventPerson(eventPerson: EventPerson) {
        try {
            return await AlumnRepository.addPersonToEvent(eventPerson);
        } catch (error: any) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    public static async restEventPerson(eventPerson: EventPerson) {
        try {
            return await AlumnRepository.restPersonToEvent(eventPerson);
        } catch (error: any) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    public static async findByNameModify(name: string) {
        try {
            return await AlumnRepository.findByNameAll(name)
        } catch (error: any) {
            throw new Error(`this is an error xD ${error}`)
        }
    }

    public static async findByTypeGame(type_game: string) {
        try {
            return await AlumnRepository.findByNameAllType(type_game)
        } catch (error: any) {
            throw new Error(`this is an error xD ${error}`)
        }
    }


    public static async findEventAllId(id_personal: number) {
        try {
            return await AlumnRepository.finMyEventsIn(id_personal)
            
        } catch (error: any) {
            throw new Error(`this is an error xD ${error}`)
        }
    }

    public static async findByNameType(name?: string, type_game?: string) {
        try {
            return await AlumnRepository.findByIdProduct(name, type_game)
        } catch (error: any) {
            throw new Error(`this is an error xD ${error}`)
        }
    }

    public static async modifyProduct(name: string, staus: status) {
        try {

            const alumnFinded = await AlumnRepository.finByName(name);

            if (alumnFinded) {
                if (staus.status) {
                    alumnFinded[0].status = staus.status;
                }
            } else {
                return null;
            }
            return await AlumnRepository.updateProduct(name, staus);
        } catch (error: any) {
            throw new Error(`Error al modificar producto: ${error.message}`);
        }
    }

    /*
    public static async updateStock(productData: Array<ProductUpdate>) {
        try {
            if (!Array.isArray(productData)) {
                throw new Error("Los datos de entrada no son un array");
            }
    
            const updatePromises = productData.map(async (item) => {
                const productFound = await AlumnRepository.findByIdProduct(item.id_product);
    
                if (!productFound) {
                    throw new Error(`Producto con ID ${item.id_product} no encontrado`);
                }
    
                const productUpdate: ProductUpdate = {
                    id_product: productFound.id_product,
                    amount: item.amount
                };
    
                // Actualiza el stock en la base de datos
                return AlumnRepository.updateStock(productUpdate);
            });
    
            const results = await Promise.all(updatePromises);
            return results;
        } catch (error: any) {
            throw new Error(`Error al modificar producto: ${error.message}`);
        }
    }*/


    public static async deletProduct(name: string): Promise<boolean> {
        try {
            return await AlumnRepository.deleteProduct(name);

        } catch (error: any) {
            throw new Error(`Error al eliminar alumno: ${error.message}`);
        }
    }

    public static async deleteEventI(id_personal: number, id_event: number): Promise<boolean> {
        try {
            return await AlumnRepository.deleteEventI(id_personal, id_event);

        } catch (error: any) {
            throw new Error(`Error al eliminar alumno: ${error.message}`);
        }
    }

}