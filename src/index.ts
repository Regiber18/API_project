import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from  "path"

// Importar rutas de módulos
import alumnRoutes from './alumn/routes/alumnRoutes';
import ballotsRoute from './ballot/routes/ballotRoutes';
import personalRoute from "./personal/routes/personalRoutes"; 
import classRoutes from "./class/routes/classRoutes";
import roleRoutes from './role/routes/RoleRoutes';
import reportRoutes from './report/routes/reportRoute';
import subjectRoutes from './subject/routes/subjectRoutes';
import  ratingRoutes  from './rating/routes/ratingRoutes';

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
const corsOptions = {
  origin: 'http://localhost:5173', // Ahí va el de el dominio
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Habilitar el envío de cookies y encabezados de autenticación HTTP
  optionsSuccessStatus: 204
};

import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://example.com');

    await browser.close();
  } catch (error) {
    console.error('Error launching Puppeteer:', error);
  }
})();


app.use(cors(corsOptions));

app.use('/api/alumn', alumnRoutes);
app.use('/api/ballot', ballotsRoute);
app.use('/api/personal', personalRoute);
app.use('/api/class', classRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/rating', ratingRoutes);

//ruta de los pdfs
app.use('/pdfs', express.static(path.join(__dirname, '/pdfs')));
console.log(__dirname);



// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
