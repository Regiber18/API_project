import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Importar rutas de módulos
import alumnRoutes from './alumn/routes/alumnRoutes';
import ballotsRoute from './ballot/routes/ballotRoutes';
import personalRoute from "./personal/routes/personalRoutes"; 
import classRoutes from "./class/routes/classRoutes"



// Importar middlewares compartidos
import { errorHandler } from './shared/middlewares/errorHandler';
import { notFoundHandler } from './shared/middlewares/notFoundHandler';

// Configuración de variables de entorno
dotenv.config();

// Crear la aplicación de Express
const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10);

// Middleware de análisis del cuerpo
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas de los módulos
app.use('/api/alumn', alumnRoutes);
app.use('/api/ballot', ballotsRoute)
app.use('/api/personal', personalRoute)
app.use('/api/class', classRoutes)

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});