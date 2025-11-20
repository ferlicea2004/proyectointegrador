// utils/imageHelper.js
// Helper para manejar URLs de imágenes

import { API_BASE } from '../services/api';
import productImages from '../assets/images/productimages';

export const getProductImageSource = (imageName) => {
  if (!imageName) {
    return null;
  }

  // Si existe en productImages locales, usar esa
  if (productImages[imageName]) {
    return productImages[imageName];
  }

  // Si es URL completa de Cloudinary (empieza con http)
  if (imageName.startsWith('http')) {
    return { uri: imageName };
  }

  // Si no, usar la del servidor Railway
  return { uri: `${API_BASE}/uploads/productos/${imageName}` };
};