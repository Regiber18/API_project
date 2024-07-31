import { PersonalRepository } from "../repositories/PersonalRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Personal } from "../models/Personal";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { jsPDF } from "jspdf";
import { AlumnData } from "../models/AlumnData";
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
            personal.alumns = [];
            personal.created_at = DateUtils.formatDate(new Date());
            personal.updated_at = DateUtils.formatDate(new Date());
            personal.password = await bcrypt.hash(personal.password, salt);
            personal.url = '';
            return await PersonalRepository.createPersonal(personal);
        } catch (error: any) {
            throw new Error(`Error creating personal record: ${error.message}`);
        }
    }

    public static async modifyPersonal(personalId: number, personalData: Personal, alumnos: AlumnData[]): Promise<Personal | null> {
        try {
            const urlProject = process.env.URL;
            const portProject = process.env.PORT;
    
            const personalFound = await PersonalRepository.findById(personalId);

            if (!personalFound) throw new Error('Registro personal no encontrado');
    
            const idSet = new Set(alumnos.map(a => a.alumn_id));
            if (idSet.size !== alumnos.length) throw new Error('Se encontró el mismo ID');
            if (!alumnos || alumnos.length === 0) throw new Error('No se encontraron alumnos');
    
            const doc = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter' });
            doc.setFontSize(18).setFont('Helvetica', 'bold').text('Lista de Alumnos', 0.5, 1);
            doc.setFontSize(14).text(`Escuela Chiapa Unida - Clase ${personalFound.class_id}A`, 0.5, 1.5);
            doc.text(`Maestro: ${personalData.name || 'Desconocido'} ${personalData.lastName}`, 0.5, 2);
    
            const startX = 0.5, startY = 2.25, columnWidths = [1.5, 3, 3], rowHeight = 0.25;
            let currentY = startY;
    
            doc.setFontSize(12).setFont('Helvetica', 'bold').setFillColor(220, 230, 255);
            doc.rect(startX - 0.1, currentY - 0.1, columnWidths.reduce((a, b) => a + b, 0) + 0.2, rowHeight + 0.2, 'F');
            doc.setTextColor(0, 0, 0).text('Num. lista', startX, currentY + 0.1);
            doc.text('Nombre', startX + columnWidths[0], currentY + 0.1);
            doc.text('Apellido', startX + columnWidths[0] + columnWidths[1], currentY + 0.1);
    
            currentY += rowHeight + 0.1;
            doc.setLineWidth(0.09).setDrawColor(0, 0, 0).line(startX - 0.1, currentY, startX + columnWidths.reduce((a, b) => a + b, 0) + 0.2, currentY);
    
            doc.setFont('Helvetica', 'normal');
            alumnos.forEach(alumno => {
                currentY += rowHeight;
                doc.text(alumno.alumn_id?.toString() || '', startX, currentY + 0.1);
                doc.text(alumno.name, startX + columnWidths[0], currentY + 0.1);
                doc.text(alumno.lastName, startX + columnWidths[0] + columnWidths[1], currentY + 0.1);
            });
    
            const pdfPath = `pdfs/lista_asistencia_Grupo${personalData.class_id || 'unknown'}A_maestro_${personalData.name || 'unknown'}_${personalData.lastName || 'unknown'}.pdf`;
            doc.save(pdfPath);
            const pdfUrl = `${urlProject}:${portProject}/${pdfPath}`;
            personalFound.url = pdfUrl;
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
            throw new Error(`Error al actualizar el registro personal: ${error.message}`);
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
