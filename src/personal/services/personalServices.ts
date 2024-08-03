import { PersonalRepository } from "../repositories/PersonalRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Personal } from "../models/Personal";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AlumnData } from "../models/AlumnData";
dotenv.config();

const secretKey = process.env.SECRET || "";
const saltRounds = 10;

export class PersonalServices {

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
            personal.alumns = [];
            personal.created_at = DateUtils.formatDate(new Date());
            personal.updated_at = DateUtils.formatDate(new Date());
            personal.password = await bcrypt.hash(personal.password, salt);
            personal.url = [];
            return await PersonalRepository.createPersonal(personal);
        } catch (error: any) {
            throw new Error(`Error creating personal record: ${error.message}`);
        }
    }

    public static async modifyPersonal(personalId: number, personalData: Personal, alumnos: AlumnData[], file: Express.Multer.File): Promise<Personal | null> {
        try {
            const urlProject = process.env.URL;
            const portProject = process.env.PORT;
    
            const personalFound = await PersonalRepository.findById(personalId);
    
            if (!personalFound) throw new Error('Registro personal no encontrado');
    
            const idSet = new Set(alumnos.map(a => a.alumn_id));
            if (idSet.size !== alumnos.length) throw new Error('Se encontró el mismo ID');
            if (!alumnos || alumnos.length === 0) throw new Error('No se encontraron alumnos');
    
            const pdfUrl = `${urlProject}:${portProject}/pdfs/${file.filename}`;
            personalFound.url = [...(personalFound.url || []), pdfUrl]; 
            personalFound.alumns = alumnos;
    
            const salt = await bcrypt.genSalt(saltRounds);
            if (personalData.name) personalFound.name = personalData.name;
            if (personalData.lastName) personalFound.lastName = personalData.lastName;
            if (personalData.password) personalFound.password = await bcrypt.hash(personalData.password, salt);
            if (personalData.deleted !== undefined) personalFound.deleted = personalData.deleted;
    
            personalFound.updated_by = personalData.updated_by;
            personalFound.updated_at = DateUtils.formatDate(new Date());
    
            return await PersonalRepository.updatePersonal(personalFound);
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
                lastName: personal.lastName,
                role: personal.role_id,
                id: personal.personal_id
            };

            return await jwt.sign(payload, secretKey, { expiresIn: '1h' });

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
