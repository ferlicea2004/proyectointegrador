// routes/clientes.js
const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// GET /api/clientes - Obtener todos los clientes (ADMIN)
router.get('/', clientesController.obtenerClientes);

// POST /api/clientes/registro - Registrar cliente
router.post('/registro', clientesController.registrarCliente);

// POST /api/clientes/login - Login de cliente
router.post('/login', clientesController.loginCliente);

// GET /api/clientes/:id - Obtener perfil
router.get('/:id', clientesController.obtenerPerfil);

// PUT /api/clientes/:id - Actualizar perfil
router.put('/:id', clientesController.actualizarPerfil);

// GET /api/clientes/:id/pedidos - Obtener pedidos del cliente
router.get('/:id/pedidos', clientesController.obtenerPedidosCliente);

module.exports = router;