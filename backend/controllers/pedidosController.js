// controllers/pedidosController.js
// Lógica de negocio para pedidos

const { pool } = require('../config/database');

// Obtener todos los pedidos
const getAllPedidos = async (req, res) => {
    try {
        const [pedidos] = await pool.query(`
            SELECT p.*, c.nombre as cliente_nombre, c.email, c.telefono
            FROM pedidos p
            JOIN clientes c ON p.cliente_id = c.id
            ORDER BY p.fecha_creacion DESC
        `);
        
        res.json({
            success: true,
            count: pedidos.length,
            data: pedidos
        });
    } catch (error) {
        console.error('Error obteniendo pedidos:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener pedidos'
        });
    }
};

// Obtener pedido por ID
const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [pedido] = await pool.query(`
            SELECT p.*, c.nombre as cliente_nombre, c.email, c.telefono
            FROM pedidos p
            JOIN clientes c ON p.cliente_id = c.id
            WHERE p.id = ?
        `, [id]);
        
        if (pedido.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Pedido no encontrado'
            });
        }
        
        // Obtener productos del pedido
        const [productos] = await pool.query(`
            SELECT pp.*, pm.nombre, pm.precio as precio_actual
            FROM pedido_productos pp
            LEFT JOIN productos_minoreo pm ON pp.producto_id = pm.id
            WHERE pp.pedido_id = ?
        `, [id]);
        
        res.json({
            success: true,
            data: {
                ...pedido[0],
                productos
            }
        });
    } catch (error) {
        console.error('Error obteniendo pedido:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener pedido'
        });
    }
};

// Crear nuevo pedido
const createPedido = async (req, res) => {
    try {
        const { cliente_id, tipo, total, via, productos, notas, cliente_info } = req.body;
        
        // Validar que vengan productos
        if (!productos || productos.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'El pedido debe tener al menos un producto'
            });
        }

       // Validar stock disponible SOLO si NO es mayoreo
        if (tipo !== 'mayoreo') {
            for (const producto of productos) {
                const [stockCheck] = await pool.query(
                    'SELECT stock FROM productos_minoreo WHERE id = ?',
                    [producto.id]
                );
        
                if (stockCheck.length === 0) {
                    return res.status(404).json({
                        success: false,
                        error: `Producto con ID ${producto.id} no encontrado`
                    });
                }

                if (stockCheck[0].stock < producto.cantidad) {
                    return res.status(400).json({
                        success: false,
                        error: `Stock insuficiente para ${producto.nombre}. Disponible: ${stockCheck[0].stock}`
                    });
                }
            }
        }
        
        // Generar número de pedido
        const [lastPedido] = await pool.query(
            'SELECT numero_pedido FROM pedidos ORDER BY id DESC LIMIT 1'
        );
        
        let numeroNuevo = 'KR-001';
        if (lastPedido.length > 0) {
            const ultimo = parseInt(lastPedido[0].numero_pedido.split('-')[1]);
            numeroNuevo = `KR-${String(ultimo + 1).padStart(3, '0')}`;
        }

        // Crear o buscar cliente
        let clienteIdFinal = cliente_id;  // ← ESTE YA VIENE DEL FRONTEND
        
        if (!clienteIdFinal && cliente_info) {
            // Buscar si el cliente ya existe por email o teléfono
            const [clienteExistente] = await pool.query(
                'SELECT id FROM clientes WHERE email = ? OR telefono = ?',
                [cliente_info.email || '', cliente_info.telefono || '']
            );

            if (clienteExistente.length > 0) {
                clienteIdFinal = clienteExistente[0].id;
            } else {
                // Crear nuevo cliente
                const [nuevoCliente] = await pool.query(
                    'INSERT INTO clientes (nombre, email, telefono, como_nos_conocio) VALUES (?, ?, ?, ?)',
                    [cliente_info.nombre, cliente_info.email, cliente_info.telefono, cliente_info.como_nos_conocio || 'App']
                );
                clienteIdFinal = nuevoCliente.insertId;
            }
        }
        
        // Insertar pedido (con cliente_id que puede ser NULL para invitados)
        const [result] = await pool.query(`
            INSERT INTO pedidos (numero_pedido, cliente_id, tipo, total, via, notas, estado)
            VALUES (?, ?, ?, ?, ?, ?, 'pendiente')
        `, [numeroNuevo, clienteIdFinal || null, tipo, total, via, notas || null]);
        
        const pedidoId = result.insertId;
        
        // Insertar productos del pedido y actualizar stock
        for (const producto of productos) {
            // Insertar en pedido_productos
            await pool.query(`
                INSERT INTO pedido_productos (pedido_id, producto_id, tipo_item, cantidad, precio_unitario)
                VALUES (?, ?, 'producto', ?, ?)
            `, [pedidoId, producto.id, producto.cantidad, producto.precio]);

            // Actualizar stock
            if (tipo !== 'mayoreo') {
            await pool.query(`
                UPDATE productos_minoreo 
                SET stock = stock - ?
                WHERE id = ?
            `, [producto.cantidad, producto.id]);
        }
        }
        
        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data: {
                id: pedidoId,
                numero_pedido: numeroNuevo,
                cliente_id: clienteIdFinal,
                total: total
            }
        });
    } catch (error) {
        console.error('Error creando pedido:', error);
        res.status(500).json({
            success: false,
            error: 'Error al crear pedido'
        });
    }
};

// Actualizar pedido
const updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, notas } = req.body;
        
        await pool.query(`
            UPDATE pedidos 
            SET estado = ?, notas = ?
            WHERE id = ?
        `, [estado, notas, id]);
        
        res.json({
            success: true,
            message: 'Pedido actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando pedido:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar pedido'
        });
    }
};

// Cambiar estado de un pedido
const cambiarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Validar estado
        const estadosValidos = ['pendiente', 'completado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                error: 'Estado inválido'
            });
        }

        await pool.query(
            'UPDATE pedidos SET estado = ? WHERE id = ?',
            [estado, id]
        );

        res.json({
            success: true,
            message: 'Estado actualizado'
        });
    } catch (error) {
        console.error('Error actualizando estado:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar estado'
        });
    }
};

module.exports = {
    getAllPedidos,
    getPedidoById,
    createPedido,
    updatePedido,
    cambiarEstadoPedido
};