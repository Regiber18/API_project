import { PersonalRepository } from "../repositories/PersonalRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Personal } from "../models/Personal";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.SECRET || "";

const saltRounds = 10;

export class personalServices {

    public static async getAllEmployees(): Promise<Personal[]> {
        try {
            return await PersonalRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error al obtener personal: ${error.message}`);
        }
    }

    public static async getEmployeeById(personalId: number): Promise<Personal | null> {
        try {
            return await PersonalRepository.findById(personalId);
        } catch (error: any) {
            throw new Error(`Error al encontrar personal: ${error.message}`);
        }
    }

    public static async addEmployee(personal: Personal) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            personal.created_at = DateUtils.formatDate(new Date());
            personal.updated_at = DateUtils.formatDate(new Date());
            personal.password = await bcrypt.hash(personal.password, salt);  
            return await PersonalRepository.createPersonal(personal);
        } catch (error: any) {
            throw new Error(`Error al crear personal: ${error.message}`);
        }
    }

    public static async modifyEmployee(personalId: number, personalData: Personal) {
        try {
            const personalFinded = await PersonalRepository.findById(personalId);
            if (!personalFinded) {
                return null;
            }

            const salt = await bcrypt.genSalt(saltRounds);

            if (personalData.name) {
                personalFinded.name = personalData.name;
            }
            if (personalData.password) {  
                personalFinded.password = await bcrypt.hash(personalData.password, salt);  
            }
            if(personalData.deleted){
                personalData.deleted = personalData.deleted;
            }

            personalFinded.updated_by = personalData.updated_by;
            personalFinded.updated_at = DateUtils.formatDate(new Date());

            return await PersonalRepository.updatePersonal(personalId, personalFinded);
        } catch (error: any) {
            throw new Error(`Error al modificar personal: ${error.message}`);
        }
    }

    public static async deleteEmployee(personal_id: number): Promise<boolean> {
        try {
            return await PersonalRepository.deletePersonal(personal_id);
        } catch (error: any) {
            throw new Error(`Error al eliminar personal: ${error.message}`);
        }
    }

    public static async login(name: string, password: string) {
        try {
            const personal = await this.getEmployeeByFullName(name);
            if (!personal) {
                return null;
            }
            const passwordMatch = await bcrypt.compare(password, personal.password);  
            if (!passwordMatch) {
                return null;
            }

            const payload = {
                personal_id: personal.personal_id,
                name: personal.name,
            }
            return jwt.sign(payload, secretKey, { expiresIn: '1h' });

        } catch (error: any) {
            throw new Error(`Error al logearse: ${error.message}`);
        }
    }

    public static async getEmployeeByFullName(personalId: string): Promise<Personal | null> {
        try {
            return await PersonalRepository.findByFullName(personalId);
        } catch (error: any) {
            throw new Error(`Error al encontrar personal: ${error.message}`);
        }
    }
}
