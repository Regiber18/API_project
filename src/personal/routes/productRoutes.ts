import { Router } from "express";
import { getAlumnAll, getAlumnName, createProduct, updateALumn, deleteAlumn, loginAlumn } from "../controllers/productController";

const personalRoutes: Router = Router();

// Obtener todos los alumnos
personalRoutes.get('/', getAlumnAll);

// Obtener un alumno por ID
personalRoutes.get('/:id_personal', getAlumnName);

// Iniciar sesión
personalRoutes.post('/login', loginAlumn);

// Crear un nuevo alumno
personalRoutes.post('/', createProduct);

// Actualizar un alumno existente
personalRoutes.put('/:id_personal', updateALumn);

// Eliminar un alumno
personalRoutes.delete('/:id_personal', deleteAlumn);

export default personalRoutes;
