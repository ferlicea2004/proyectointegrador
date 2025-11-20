// routes/auth.js
// Rutas para autenticación

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login - Login de admin
router.post('/login', authController.login);

// POST /api/auth/register - Registro de cliente
router.post('/register', authController.register);

module.exports = router;