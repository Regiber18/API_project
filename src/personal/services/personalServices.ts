// PersonalServices.ts
import { PersonalRepository } from "../repositories/PersonalRepository";
import { DateUtils } from "../../shared/utils/Date";
import { Personal } from "../models/Personal";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { AlumnData } from "../models/AlumnData";
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

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
            // Deja que el repositorio maneje la generación del ID
            return await PersonalRepository.createPersonal(personal);
        } catch (error: any) {
            throw new Error(`Error creating personal record: ${error.message}`);
        }
    }

    public static async modifyPersonal(personalId: number, personalData: Personal, alumnos: AlumnData[], asistencia: any[]): Promise<Personal | null> {
        try {
            const personalFound = await PersonalRepository.findById(personalId);
            if (!personalFound) throw new Error('Registro personal no encontrado');
    
            const htmlContent = `
            <html>
            <body>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Num. lista</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Nombre</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Apellido</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Asistencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${alumnos.map(alumno => {
                            // Encuentra la entrada de asistencia correspondiente al alumno actual
                            const asistenciaStatus = asistencia.find(a => a.alumn_id === alumno.alumn_id && a.attended) ? '✔️' : '';
                            return `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${alumno.alumn_id}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${alumno.name}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${alumno.lastName}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${asistenciaStatus}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </body>
            </html>
            `;
    
            const imagePath = path.join(__dirname, 'output.png');
            await PersonalServices.generateImageFromHTML(htmlContent, imagePath);

            const pdfPath = path.join(`pdfs/pase_de_lista_${uuidv4()}.pdf`);
            await PersonalServices.createPDFFromImage(imagePath, pdfPath);
            fs.unlinkSync(imagePath);

    
            const pdfUrl = `${process.env.URL}:${process.env.PORT}/${pdfPath}`;
            personalFound.url = [pdfUrl];
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

    public static async generateImageFromHTML(htmlContent: string, outputPath: string) {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const element = await page.$('body');
        if (element) {
            await element.screenshot({ path: outputPath, type: 'png' });
        } else {
            throw new Error('El elemento para la captura de pantalla no se encontró.');
        }
        await browser.close();
    }

    public static async createPDFFromImage(imagePath: string, pdfPath: string) {
        const imgData = fs.readFileSync(imagePath);
        const pdfDoc = await PDFDocument.create();
        const image = await pdfDoc.embedPng(imgData);
        const { width, height } = image.scale(1);

        const page = pdfDoc.addPage([width, height]);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width,
            height,
        });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(pdfPath, pdfBytes);
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
