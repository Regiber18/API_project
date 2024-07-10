import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

// Importar rutas de módulos
import alumnRoutes from './alumn/routes/alumnRoutes';
import ballotsRoute from './ballot/routes/ballotRoutes';
import personalRoute from "./personal/routes/personalRoutes"; 
import classRoutes from "./class/routes/classRoutes";
import roleRoutes from './role/routes/RoleRoutes';
import assistenceRoutes from './assistence/routes/assistenceRoutes';
import reportRoutes from './report/routes/reportRoute';
import subjectRoutes from './subject/routes/subjectRoutes';

// Importar middlewares compartidos
import { errorHandler } from './shared/middlewares/errorHandler';
import { notFoundHandler } from './shared/middlewares/notFoundHandler';

// Configuración de variables de entorno
dotenv.config();

// Crear la aplicación de Express
const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 3000;

// Middleware de análisis del cuerpo
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de CORS

app.use(cors());

// Rutas de los módulos
app.use('/api/alumn', alumnRoutes);
app.use('/api/ballot', ballotsRoute);
app.use('/api/personal', personalRoute);
app.use('/api/class', classRoutes);
app.use('/role', roleRoutes);
app.use('/assistence', assistenceRoutes)
app.use('/report', reportRoutes)
app.use('/subject', subjectRoutes)

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
