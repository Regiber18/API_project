import { Response, Request } from "express";
import { PersonalServices } from "../services/personalServices";
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { PersonalPayload } from '../../shared/config/types/personalPayload';
import { AlumnData } from "../models/AlumnData";
import { Personal } from "../models/Personal";
import puppeteer from 'puppeteer';

const secretKey = process.env.SECRET || "";

// Generar una captura de pantalla desde una URL
const generateScreenshot = async (url: string, outputPath: string) => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: outputPath, type: 'png' });
    await browser.close();
};

// Obtener todos los registros personales
export const getPersonalAll = async (_req: Request, res: Response) => {
    try {
        const personal = await PersonalServices.getAllPersonal();
        if (personal.length > 0) {
            res.status(200).json(personal);
        } else {
            res.status(404).json({ message: 'No se encontraron registros' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un registro personal por ID
export const getPersonalId = async (req: Request, res: Response) => {
    try {
        const personal = await PersonalServices.getPersonalById(parseInt(req.params.personal_id, 10));
        if (personal) {
            res.status(200).json(personal);
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// Crear un nuevo registro personal
export const createPersonal = async (req: Request, res: Response) => {
    try {
        const newEmployee = await PersonalServices.addPersonal(req.body);
        res.status(201).json(newEmployee);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un registro personal existente
export const updatePersonal = async (req: Request, res: Response) => {
    try {
        const personalId = parseInt(req.params.personal_id, 10);
        const personalData: Partial<Personal> = req.body.personalData;
        const alumnos: AlumnData[] = req.body.alumnos || [];
        const asistencia: { alumn_id: number, attended: boolean }[] = req.body.asistencia || [];
        const urlStrings: string[] = personalData.url || [];  

        if (!Array.isArray(urlStrings) || urlStrings.some(url => typeof url !== 'string')) {
            throw new Error('La URL debe ser una lista de cadenas.');
        }

        const pdfUrls: string[] = [];

        for (const url of urlStrings) {
            const screenshotPath = path.join(__dirname, `output-${Date.now()}.png`);
            try {
                await generateScreenshot(url, screenshotPath);
                const timestamp = Date.now();
                const pdfPath = path.join(__dirname, `pdfs/pase_de_lista_${timestamp}.pdf`);
                await PersonalServices.createPDFFromImage(screenshotPath, pdfPath);
                const pdfUrl = `${process.env.URL}:${process.env.PORT}/${pdfPath}`;
                pdfUrls.push(pdfUrl);
                fs.unlinkSync(screenshotPath); // Eliminar el archivo temporal
            } catch (error) {
                console.error(`Error generando PDF para URL ${url}:`, error);
                // Eliminar el archivo temporal en caso de error
                if (fs.existsSync(screenshotPath)) {
                    fs.unlinkSync(screenshotPath);
                }
                throw new Error('Error al procesar una de las URLs.');
            }
        }

        // Actualizar los datos personales
        const updatedEmployee = await PersonalServices.modifyPersonal(personalId, { ...personalData, url: pdfUrls }, alumnos, asistencia);

        if (updatedEmployee) {
            res.status(200).json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (error: any) {
        console.error('Error actualizando registro personal:', error);
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un registro personal
export const deletePersonal = async (req: Request, res: Response) => {
    try {
        const deleted = await PersonalServices.deletePersonal(parseInt(req.params.personal_id, 10));
        if (deleted) {
            res.status(200).json({ message: "Eliminado exitosamente" });
        } else {
            res.status(404).json({ message: "No se encontró el registro" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Iniciar sesión
export const loginPersonal = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    try {
        const token = await PersonalServices.login(name, password);

        if (!token) {
            return res.status(401).json({ message: 'Nombre de usuario o contraseña inválidos' });
        } else {
            const personal = jwt.verify(token, secretKey) as PersonalPayload;
            res.setHeader("Authorization", token);
            res.setHeader("Access-Control-Expose-Headers", "Authorization");
            res.status(200).json({ message: 'Inicio de sesión exitoso', personal });
        }
    } catch (error: any) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
