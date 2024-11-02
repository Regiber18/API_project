import { Response, Request } from "express";
import { ProductService } from "../services/productService";
import jwt from 'jsonwebtoken';
import { PersonalPayload } from '../../shared/config/types/personalPayload';

const secretKey = process.env.SECRET || "";

// Obtener todos los alumnos
export const getAlumnAll = async (_req: Request, res: Response) => {
    try {
        const alumns = await ProductService.getAllProducts();
        if (alumns.length > 0) {
            res.status(200).json(alumns);
        } else {
            res.status(404).json({ message: 'No se encontraron alumnos' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un alumno por ID
export const getAlumnName = async (req: Request, res: Response) => {
    try {
        const alumn = await ProductService.getAlumnName(parseInt(req.params.id_personal, 10));
        if (alumn) {
            res.status(200).json(alumn);
        } else {
            res.status(404).json({ message: 'Alumno no encontrado' });
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// Crear un nuevo alumno
export const createProduct = async (req: Request, res: Response) => {
    try {
        const newAlumn = await ProductService.addAlumn(req.body);
        res.status(201).json(newAlumn);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un alumno existente
export const updateALumn = async (req: Request, res: Response) => {
    try {
        const updatedAlumn = await ProductService.modifyProduct(parseInt(req.params.id_personal, 10), req.body);
        if (updatedAlumn) {
            res.status(200).json(updatedAlumn);
        } else {
            res.status(404).json({ message: 'Alumno no encontrado' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un alumno
export const deleteAlumn = async (req: Request, res: Response) => {
    try {
        const deleted = await ProductService.deletProduct(req.params.name, req.params.brand);
        if (deleted) {
            res.status(200).json({ message: "Alumno eliminado exitosamente" });
        } else {
            res.status(404).json({ message: "Alumno no encontrado" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Iniciar sesión
export const loginAlumn = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    try {
        const token = await ProductService.login(name, password);
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
