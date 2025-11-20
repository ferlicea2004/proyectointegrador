// controllers/authController.js
// Lógica de autenticación

const { pool } = require('../config/database');

// Login de admin
const login = async (req, res) => {
    try {
        const { nombre, password } = req.body;
        
        // Buscar admin por nombre
        const [admin] = await pool.query(
            'SELECT * FROM usuarios_admin WHERE nombre = ?',
            [nombre]
        );
        
        if (admin.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
        
        // Por ahora comparación simple (después agregaremos bcrypt)
        // En producción NUNCA hagas esto, usa bcrypt
        const user = admin[0];
        
        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            error: 'Error en el login'
        });
    }
};

// Registro de cliente
const register = async (req, res) => {
    try {
        const { nombre, email, telefono, password, como_nos_conocio } = req.body;

        
        // Verificar si el email ya existe
        const [existing] = await pool.query(
            'SELECT id FROM clientes WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'El email ya está registrado'
            });
        }
        
        // Insertar nuevo cliente
        const [result] = await pool.query(`
            INSERT INTO clientes (nombre, email, telefono, password, como_nos_conocio)
            VALUES (?, ?, ?, ?, ?)
        `, [nombre, email, telefono, password, como_nos_conocio]);

        
        res.status(201).json({
            success: true,
            message: 'Cliente registrado exitosamente',
            data: {
                id: result.insertId,
                nombre,
                email
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            error: 'Error al registrar cliente'
        });
    }
};

module.exports = {
    login,
    register
};