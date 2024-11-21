import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuración del almacenamiento de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Especifica el directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFileName); // Genera un nombre único para el archivo
  }
});

// Filtro de tipos de archivo (acepta imágenes JPEG, JPG, PNG, GIF)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/; // Tipos de archivo permitidos
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb(new Error('Formato de archivo no soportado'));
};

// Configuración general de multer
export const upload = multer({
  storage,
  fileFilter
});