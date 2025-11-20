// controllers/clientesController.js
const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

// Registrar nuevo cliente
const registrarCliente = async (req, res) => {
    try {
        const { nombre, email, telefono, password, como_nos_conocio } = req.body;
        // Validaciones
        if (!nombre || !email || !telefono || !password) {
            return res.status(400).json({
                success: false,
                error: 'Nombre, email, teléfono y contraseña son obligatorios'
            });
        }

        // Verificar si el email ya existe
        const [existente] = await pool.query(
            'SELECT id FROM clientes WHERE email = ?',
            [email]
        );

        if (existente.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Este email ya está registrado'
            });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar cliente (usando las columnas exactas de tu BD)
        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, email, telefono, password, como_nos_conocio) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, telefono, hashedPassword, como_nos_conocio || 'App móvil']
        );

        // Obtener cliente creado (sin password)
        const [cliente] = await pool.query(
            'SELECT id, nombre, email, telefono, como_nos_conocio, fecha_registro FROM clientes WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Cuenta creada exitosamente',
            data: cliente[0]
        });
    } catch (error) {
        console.error('Error registrando cliente:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear cuenta'
        });
    }
};

// Login de cliente
const loginCliente = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email y contraseña son obligatorios'
            });
        }

        // Buscar cliente
        const [clientes] = await pool.query(
            'SELECT * FROM clientes WHERE email = ?',
            [email]
        );

        if (clientes.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Email o contraseña incorrectos'
            });
        }

        const cliente = clientes[0];

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, cliente.password);

        if (!passwordValido) {
            return res.status(401).json({
                success: false,
                error: 'Email o contraseña incorrectos'
            });
        }

        // Actualizar última sesión
        await pool.query(
            'UPDATE clientes SET ultimo_acceso = NOW() WHERE id = ?',
            [cliente.id]
        );

        // Retornar datos (sin password)
        const { password: _, ...clienteData } = cliente;

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: clienteData
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            error: 'Error al iniciar sesión'
        });
    }
};

// Obtener perfil de cliente
const obtenerPerfil = async (req, res) => {
    try {
        const { id } = req.params;

        const [clientes] = await pool.query(
            'SELECT id, nombre, email, telefono, como_nos_conocio, fecha_registro FROM clientes WHERE id = ?',
            [id]
        );

        if (clientes.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Cliente no encontrado'
            });
        }

        res.json({
            success: true,
            data: clientes[0]
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener perfil'
        });
    }
};

// Actualizar perfil
const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono } = req.body;

        const [result] = await pool.query(
            'UPDATE clientes SET nombre = ?, telefono = ? WHERE id = ?',
            [nombre, telefono, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Cliente no encontrado'
            });
        }

        // Obtener datos actualizados
        const [clientes] = await pool.query(
            'SELECT id, nombre, email, telefono FROM clientes WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Perfil actualizado',
            data: clientes[0]
        });
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar perfil'
        });
    }
};
// Obtener pedidos de un cliente
const obtenerPedidosCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const [pedidos] = await pool.query(`
            SELECT 
                p.id,
                p.numero_pedido,
                p.total,
                p.estado,
                p.fecha_creacion,
                COUNT(pp.id) as total_productos
            FROM pedidos p
            LEFT JOIN pedido_productos pp ON p.id = pp.pedido_id
            WHERE p.cliente_id = ?
            GROUP BY p.id
            ORDER BY p.fecha_creacion DESC
        `, [id]);

        res.json({
            success: true,
            count: pedidos.length,
            data: pedidos
        });
    } catch (error) {
        console.error('Error obteniendo pedidos del cliente:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener pedidos'
        });
    }
};
// Obtener todos los clientes (ADMIN)
const obtenerClientes = async (req, res) => {
  try {
    const [clientes] = await pool.query(`
      SELECT 
        c.id,
        c.nombre,
        c.email,
        c.telefono,
        c.como_nos_conocio,
        c.fecha_registro,
        COUNT(DISTINCT p.id) as total_pedidos,
        COALESCE(SUM(CASE WHEN p.estado = 'completado' THEN p.total ELSE 0 END), 0) as total_gastado
      FROM clientes c
      LEFT JOIN pedidos p ON c.id = p.cliente_id
      GROUP BY c.id, c.nombre, c.email, c.telefono, c.como_nos_conocio, c.fecha_registro
      ORDER BY c.fecha_registro DESC
    `);
    
    res.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener clientes'
    });
  }
};

module.exports = {
    registrarCliente,
    loginCliente,
    obtenerPerfil,
    actualizarPerfil,
    obtenerPedidosCliente,
    obtenerClientes  
};