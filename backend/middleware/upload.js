// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Detectar entorno
const isProduction = process.env.NODE_ENV === 'production';

let storage;

if (isProduction) {
  // ☁️ PRODUCCIÓN: Usar Cloudinary
  console.log('☁️ Usando Cloudinary para almacenamiento de imágenes');
  
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'kraken-store/productos',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto' }]
    }
  });
} else {
  // 💻 DESARROLLO: Usar carpeta local
  console.log('💻 Usando almacenamiento local para imágenes');
  
  const uploadDir = path.join(__dirname, '../uploads/productos');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Carpeta uploads/productos creada');
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/productos/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'producto-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

// Filtro para solo aceptar imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: fileFilter
});

module.exports = upload;