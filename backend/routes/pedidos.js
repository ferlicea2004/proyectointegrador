// routes/pedidos.js
// Rutas para pedidos

const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// GET /api/pedidos - Obtener todos los pedidos
router.get('/', pedidosController.getAllPedidos);

// GET /api/pedidos/:id - Obtener un pedido por ID
router.get('/:id', pedidosController.getPedidoById);

// POST /api/pedidos - Crear nuevo pedido
router.post('/', pedidosController.createPedido);

// PUT /api/pedidos/:id - Actualizar estado de pedido
router.put('/:id', pedidosController.updatePedido);

// PUT /api/pedidos/:id/estado - Cambiar estado
router.put('/:id/estado', pedidosController.cambiarEstadoPedido);

module.exports = router;