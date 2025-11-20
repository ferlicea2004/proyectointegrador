// server.js
// Servidor principal de Kraken Store

const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const { testConnection } = require('./config/database');

// Importar rutas (las crearemos después)
const productosRoutes = require('./routes/productos');
const pedidosRoutes = require('./routes/pedidos');
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');

// Crear app de Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permitir peticiones desde React Native
app.use(express.json()); // Parsear JSON en requests
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static('uploads')); 

// Ruta de prueba (para verificar que el servidor funciona)
app.get('/', (req, res) => {
    res.json({
        message: '🐙 Bienvenido a Kraken Store API',
        version: '1.0.0',
        status: 'active'
    });
});

// Rutas principales
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);

// Ruta 404 (no encontrada)
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.path
    });
});

// Iniciar servidor
const startServer = async () => {
    // Verificar conexión a BD
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
        console.error('❌ No se pudo conectar a la base de datos');
        console.error('⚠️  Asegúrate de que XAMPP esté corriendo');
        process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
        console.log('');
        console.log('═══════════════════════════════════════');
        console.log('🐙  KRAKEN STORE API');
        console.log('═══════════════════════════════════════');
        console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
        console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
        console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
        console.log('═══════════════════════════════════════');
        console.log('');
        console.log('Rutas disponibles:');
        console.log(`  GET  http://localhost:${PORT}/`);
        console.log(`  GET  http://localhost:${PORT}/api/productos`);
        console.log(`  GET  http://localhost:${PORT}/api/pedidos`);
        console.log(`  POST http://localhost:${PORT}/api/auth/login`);
        console.log('');
    });
};

// Iniciar
startServer();