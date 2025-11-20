// routes/productos.js
// Rutas para productos

const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const upload = require('../middleware/upload');  // ← AGREGAR ESTO


// GET /api/productos - Obtener todos los productos
router.get('/', productosController.getAllProductos);

// GET /api/productos/mayoreo - Obtener productos de mayoreo
router.get('/mayoreo', productosController.getProductosMayoreo);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', productosController.getProductoById);

// GET /api/productos/categoria/:categoria - Obtener productos por categoría
router.get('/categoria/:categoria', productosController.getProductosByCategoria);

// GET /api/productos/destacados - Obtener productos destacados
router.get('/destacados/list', productosController.getProductosDestacados);

// PUT /api/productos/:id/stock - Actualizar stock
router.put('/:id/stock', productosController.actualizarStock);

// PUT /api/productos/:id/precio - Actualizar precio
router.put('/:id/precio', productosController.actualizarPrecio);

// PUT /api/productos/:id/destacado - Toggle destacado
router.put('/:id/destacado', productosController.toggleDestacado);

// POST /api/productos - Crear nuevo producto (con imagen)
router.post('/', upload.single('imagen'), productosController.crearProducto);  

module.exports = router;