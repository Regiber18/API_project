import multer from 'multer';

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Ruta donde se guardarán los archivos subidos
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    // Nombre del archivo guardado (se recomienda que sea único, por el Date.now().)
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Crea la instancia de multer con la configuración de almacenamiento
const upload = multer({ storage });

// Exporta el middleware para su uso en las rutas
export default upload;