import { Response, Request } from "express";
import { PersonalServices } from "../services/personalServices";
import jwt from 'jsonwebtoken';
import path from 'path';
import { PersonalPayload } from '../../shared/config/types/personalPayload';
import { AlumnData } from "../models/AlumnData";
import { Personal } from "../models/Personal";
import puppeteer from 'puppeteer';

const secretKey = process.env.SECRET || "";
const generateScreenshot = async (url: string, outputPath: string) => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser', // Actualiza la ruta si es necesario
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: outputPath, type: 'png' });
    await browser.close();
};

export const getPersonalAll = async (_req: Request, res: Response) => {
    try {
        const personal = await PersonalServices.getAllPersonal();
        if (personal) {
            res.status(200).json(personal);
        } else {
            res.status(404).json({ message: 'No se encontraron registros' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getPersonalId = async (req: Request, res: Response) => {
    try {
        const personals = await PersonalServices.getPersonalById(parseInt(req.params.personal_id, 10));
        if (personals) {
            res.status(200).json(personals);
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createPersonal = async (req: Request, res: Response) => {
    try {
        const newEmployee = await PersonalServices.addPersonal(req.body);
        if (newEmployee) {
            res.status(201).json(newEmployee);
        } else {
            res.status(404).json({ message: 'Algo salió mal' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePersonal = async (req: Request, res: Response) => {
    try {
        const personalId = parseInt(req.params.personal_id, 10);
        const personalData: Personal = req.body.personalData;
        const alumnos: AlumnData[] = req.body.alumnos || [];
        const asistencia: { alumn_id: number, attended: boolean }[] = req.body.asistencia || [];
        const urlString = personalData.url;

        if (!urlString) {
            throw new Error('La URL no está definida en los datos personales.');
        }


        let url: string;

        if (Array.isArray(urlString)) {
            url = urlString.join('');
        } else if (typeof urlString === 'string') {
            url = urlString;
        } else {
            throw new Error('La URL no es una cadena o un array de cadenas.');
        }

        const screenshotPath = path.join(__dirname, 'output.png');
        await generateScreenshot(url, screenshotPath);
        const updatedEmployee = await PersonalServices.modifyPersonal(personalId, personalData, alumnos, asistencia);

        if (updatedEmployee) {
            res.status(200).json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Registro no encontrado' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

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

export const loginPersonal = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    try {
        const result = await PersonalServices.login(name, password);

        if (!result) {
            return res.status(401).json({ message: 'Nombre de usuario o contraseña inválidos' });
        } else {
            const personal = jwt.verify(result, secretKey) as PersonalPayload;
            res.setHeader("Authorization", result);
            res.setHeader("Access-Control-Expose-Headers", "Authorization");
            res.status(200).json({ message: 'Inicio de sesión exitoso', personal });
        }

    } catch (error: any) {
        console.error('Error en inicio de sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
