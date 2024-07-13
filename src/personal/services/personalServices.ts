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

    public static async getAllPersonal(): Promise<Personal[]> {
        try {
            return await PersonalRepository.findAll();
        } catch (error: any) {
            throw new Error(`Error getting all personal records: ${error.message}`);
        }
    }

    public static async getPersonalById(personalId: number): Promise<Personal | null> {
        try {
            return await PersonalRepository.findById(personalId);
        } catch (error: any) {
            throw new Error(`Error finding personal by ID: ${error.message}`);
        }
    }

    public static async addPersonal(personal: Personal) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            personal.created_at = DateUtils.formatDate(new Date());
            personal.updated_at = DateUtils.formatDate(new Date());
            personal.password = await bcrypt.hash(personal.password, salt);  
            return await PersonalRepository.createPersonal(personal);
        } catch (error: any) {
            throw new Error(`Error creating personal record: ${error.message}`);
        }
    }

    public static async modifyPersonal(personalId: number, personalData: Personal) {
        try {
            const personalFound = await PersonalRepository.findById(personalId);
            if (!personalFound) {
                return null;
            }

            const salt = await bcrypt.genSalt(saltRounds);

            if (personalData.name) {
                personalFound.name = personalData.name;
            }
            if(personalData.lastName) {
                personalFound.lastName = personalData.lastName; 
            }
            if (personalData.password) {  
                personalFound.password = await bcrypt.hash(personalData.password, salt);  
            }
            if (personalData.deleted !== undefined) {
                personalFound.deleted = personalData.deleted;
            }

            personalFound.updated_by = personalData.updated_by;
            personalFound.updated_at = DateUtils.formatDate(new Date());

            return await PersonalRepository.updatePersonal(personalId, personalFound);
        } catch (error: any) {
            throw new Error(`Error updating personal record: ${error.message}`);
        }
    }

    public static async deletePersonal(personalId: number): Promise<boolean> {
        try {
            return await PersonalRepository.deletePersonal(personalId);
        } catch (error: any) {
            throw new Error(`Error deleting personal record: ${error.message}`);
        }
    }

    public static async login(name: string, password: string) {
        try {
            const personal = await this.getPersonalByFullName(name);
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
            };
            return jwt.sign(payload, secretKey, { expiresIn: '1h' });

        } catch (error: any) {
            throw new Error(`Error during login: ${error.message}`);
        }
    }

    public static async getPersonalByFullName(name: string): Promise<Personal | null> {
        try {
            return await PersonalRepository.findByFullName(name);
        } catch (error: any) {
            throw new Error(`Error finding personal by name: ${error.message}`);
        }
    }
}
