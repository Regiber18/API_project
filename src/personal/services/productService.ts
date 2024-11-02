import { AlumnRepository } from "../repositories/productRepository";
import { Personal } from "../models/personal";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.SECRET || "";

export class ProductService {
    public static async getAllProducts(): Promise<Personal[]> {
        try {
            return await AlumnRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error al obtener productos: ${error.message}`);
        }
    }

    public static async getAlumnName(id_personal: number): Promise<Personal | null> {
        try {
            return await AlumnRepository.findById(id_personal);
        } catch (error: any) {
            throw new Error(`Error al encontrar producto: ${error.message}`);
        }
    }

    public static async addAlumn(product: Personal) {
        try {
            const salt = await bcrypt.genSalt(10); 
            product.password = await bcrypt.hash(product.password, salt); // Asegúrate de hashear la contraseña
            return await AlumnRepository.createProduct(product);
        } catch (error: any) {
            throw new Error(`Error al crear producto: ${error.message}`);
        }
    }

    public static async modifyProduct(id_personal: number, productData: Partial<Personal>) {
        try {
            const alumnFinded = await AlumnRepository.findById(id_personal);
            if (!alumnFinded) return null;

            if (productData.name) {
                alumnFinded.name = productData.name;
            }
            if (productData.email) {
                alumnFinded.email = productData.email;
            }
            if (productData.password) {
                const salt = await bcrypt.genSalt(10);
                alumnFinded.password = await bcrypt.hash(productData.password, salt);
            }

            return await AlumnRepository.updateProduct(id_personal, alumnFinded);
        } catch (error: any) {
            throw new Error(`Error al modificar producto: ${error.message}`);
        }
    }

    public static async deletProduct(name: string, brand: string): Promise<boolean> {
        try {
            return await AlumnRepository.deleteProduct(name, brand);
        } catch (error: any) {
            throw new Error(`Error al eliminar alumno: ${error.message}`);
        }
    }

    public static async login(name: string, password: string) {
        try {
            const personal = await this.getPersonalByFullName(name);
            if (!personal) return null;

            const passwordMatch = await bcrypt.compare(password, personal.password);
            if (!passwordMatch) return null;

            const payload = {
                personal_id: personal.id_personal,
                name: personal.name,
                lastName: personal.email,
                id_role: personal.id_role,
            };

            return await jwt.sign(payload, secretKey, { expiresIn: '1h' });
        } catch (error: any) {
            throw new Error(`Error durante el inicio de sesión: ${error.message}`);
        }
    }

    public static async getPersonalByFullName(name: string): Promise<Personal | null> {
        try {
            return await AlumnRepository.findByNamePassword(name);
        } catch (error: any) {
            throw new Error(`Error al encontrar personal por nombre: ${error.message}`);
        }
    }
}
