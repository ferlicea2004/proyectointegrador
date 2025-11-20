// controllers/productosController.js
// Lógica de negocio para productos

const { pool } = require('../config/database');

// Obtener todos los productos minoreo
const getAllProductos = async (req, res) => {
    try {
        const [productos] = await pool.query(`
            SELECT * FROM productos_minoreo 
            ORDER BY destacado DESC, fecha_creacion DESC
        `);
        
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener productos'
        });
    }
};

// Obtener producto por ID
const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [producto] = await pool.query(
            'SELECT * FROM productos_minoreo WHERE id = ?',
            [id]
        );
        
        if (producto.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: producto[0]
        });
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener producto'
        });
    }
};

// Obtener productos por categoría
const getProductosByCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const [productos] = await pool.query(
            'SELECT * FROM productos_minoreo WHERE categoria = ? ORDER BY destacado DESC',
            [categoria]
        );
        
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error obteniendo productos por categoría:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener productos'
        });
    }
};

// Obtener productos destacados
const getProductosDestacados = async (req, res) => {
    try {
        const [productos] = await pool.query(
            'SELECT * FROM productos_minoreo WHERE destacado = TRUE ORDER BY fecha_creacion DESC'
        );
        
        res.json({
            success: true,
            count: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error obteniendo productos destacados:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener productos destacados'
        });
    }
};

// Actualizar stock de un producto
const actualizarStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        // Validar que el stock sea un número válido
        if (stock < 0) {
            return res.status(400).json({
                success: false,
                error: 'El stock no puede ser negativo'
            });
        }

        await pool.query(
            'UPDATE productos_minoreo SET stock = ? WHERE id = ?',
            [stock, id]
        );

        res.json({
            success: true,
            message: 'Stock actualizado'
        });
    } catch (error) {
        console.error('Error actualizando stock:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar stock'
        });
    }
};

// Actualizar precio de un producto
const actualizarPrecio = async (req, res) => {
    try {
        const { id } = req.params;
        const { precio } = req.body;

        // Validar que el precio sea válido
        if (precio <= 0) {
            return res.status(400).json({
                success: false,
                error: 'El precio debe ser mayor a 0'
            });
        }

        await pool.query(
            'UPDATE productos_minoreo SET precio = ? WHERE id = ?',
            [precio, id]
        );

        res.json({
            success: true,
            message: 'Precio actualizado'
        });
    } catch (error) {
        console.error('Error actualizando precio:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar precio'
        });
    }
};

// Toggle destacado de un producto
const toggleDestacado = async (req, res) => {
    try {
        const { id } = req.params;
        const { destacado } = req.body;

        await pool.query(
            'UPDATE productos_minoreo SET destacado = ? WHERE id = ?',
            [destacado ? 1 : 0, id]
        );

        res.json({
            success: true,
            message: 'Producto actualizado'
        });
    } catch (error) {
        console.error('Error actualizando destacado:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar producto'
        });
    }
};

// Obtener productos de mayoreo
const getProductosMayoreo = async (req, res) => {
    try {
        const [paquetes] = await pool.query(`
            SELECT 
                id,
                nombre_paquete as nombre,
                tipo as categoria,
                cantidad_piezas as cantidad_minima,
                precio_paquete as precio,
                stock_paquetes as stock,
                descripcion,
                productos_incluidos,
                porcentaje_ahorro
            FROM paquetes_mayoreo 
            ORDER BY 
                CASE 
                    WHEN nombre_paquete LIKE '%Paquete Emprendedor%' THEN 0
                    ELSE 1
                END,
                tipo, 
                nombre_paquete        
        `);
        
        // Mapeo de imágenes basado en el nombre del producto
        const paquetesConImagenes = paquetes.map(paquete => {
            let imagen = null;
            const nombreLower = paquete.nombre.toLowerCase();
            
            // Audio (NOTA: En BD dice "Airpos" sin "d")
            if (nombreLower.includes('airpos pro 2') && nombreLower.includes('oem')) {
                imagen = 'airpods-pro-2-oem.png';
            } else if (nombreLower.includes('airpos pro 1') && nombreLower.includes('oem')) {
                imagen = 'airpods-pro-1-oem.png';
            } else if (nombreLower.includes('airpos 2g') && nombreLower.includes('oem')) {
                imagen = 'airpods-2-oem.png';
            } else if (nombreLower.includes('airpos 3g') && nombreLower.includes('oem')) {
                imagen = 'airpods-3-oem.png';
            } else if (nombreLower.includes('airpos 4') && nombreLower.includes('oem')) {
                imagen = 'airpods-4-oem.png';
            } else if (nombreLower.includes('airpods max') && nombreLower.includes('clon')) {
                imagen = 'airpods-max-clon.png';
            } else if (nombreLower.includes('airpods max') && nombreLower.includes('oem')) {
                imagen = 'airpods-max-oem.png';
            } else if (nombreLower.includes('earpods jack')) {
                imagen = 'earpods-jack-oem.png';
            } else if (nombreLower.includes('earpods lightning')) {
                imagen = 'earpods-lightning-oem.png';
            }
            // Relojes
            else if (nombreLower.includes('apple watch by nike')) {
                imagen = 'apple-watch-s9-clon.png';
            } else if (nombreLower.includes('apple watch ultra')) {
                imagen = 'apple-watch-ultra-clon.png';
            } else if (nombreLower.includes('hello watch 3')) {
                imagen = 'hello-watch-3.png';
            } else if (nombreLower.includes('hello watch s8')) {
                imagen = 'haylou-s30.png';
            }
            // Baterías
            else if (nombreLower.includes('batería magsafe')) {
                imagen = 'bateria-magsafe.png';
            } else if (nombreLower.includes('batería simer')) {
                imagen = 'moreka-magsafe.png';
            }
            // Cargadores
            else if (nombreLower.includes('cargador magsafe')) {
                imagen = 'cargador-magsafe.png';
            } else if (nombreLower.includes('cargador c a l')) {
                imagen = 'cargador-C-L.png';
            } else if (nombreLower.includes('cubo de carga c')) {
                imagen = 'cubo-de-carga-C.png';
            } else if (nombreLower.includes('cubo de carga usb')) {
                imagen = 'cubo-de-carga-USB.png';
            } else if (nombreLower.includes('cable lightning')) {
                imagen = 'cable-c-lighting.png';
            }
            // Paquete mixto sin imagen
            else if (nombreLower.includes('paquete emprendedor')) {
                imagen = null;
            }
            
            return {
                ...paquete,
                imagen
            };
        });
        
        res.json({
            success: true,
            count: paquetesConImagenes.length,
            data: paquetesConImagenes
        });
    } catch (error) {
        console.error('Error obteniendo paquetes mayoreo:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener paquetes de mayoreo'
        });
    }
};
// Crear nuevo producto
const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      destacado
    } = req.body;

    // Validaciones
    if (!nombre || !precio || !stock || !categoria) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, precio, stock y categoría son obligatorios'
      });
    }

    // Procesar imagen
    let imagenNombre = null;
    if (req.file) {
        // Cloudinary devuelve la URL completa en req.file.path
        imagenNombre = req.file.path;
    }

    // Insertar producto (SIN precio_mayoreo)
    const [result] = await pool.query(
      `INSERT INTO productos_minoreo 
       (nombre, descripcion, precio, stock, categoria, destacado, imagen) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion || null,
        Number(precio),
        Number(stock),
        categoria,
        (destacado === 'true' || destacado === true || destacado === '1' || destacado === 1) ? 1 : 0,
        imagenNombre
      ]
    );

    // Obtener producto creado
    const [producto] = await pool.query(
      'SELECT * FROM productos_minoreo WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: producto[0]
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear producto'
    });
  }
};
module.exports = {
    getAllProductos,
    getProductoById,
    getProductosByCategoria,
    getProductosDestacados,
    actualizarStock,
    actualizarPrecio,
    toggleDestacado,
    getProductosMayoreo,
    crearProducto    
};