// config/database.js
// Configuración y conexión a MySQL

const mysql = require('mysql2');
require('dotenv').config();

// Detectar si estamos en Railway o local
const isProduction = process.env.NODE_ENV === 'production';

// Configuración de base de datos (cambia según entorno)
const dbConfig = {
    host: isProduction ? process.env.RAILWAY_DB_HOST : process.env.DB_HOST,
    user: isProduction ? process.env.RAILWAY_DB_USER : process.env.DB_USER,
    password: isProduction ? process.env.RAILWAY_DB_PASSWORD : process.env.DB_PASSWORD,
    database: isProduction ? process.env.RAILWAY_DB_NAME : process.env.DB_NAME,
    port: isProduction ? process.env.RAILWAY_DB_PORT : process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Mostrar configuración (sin mostrar password completo)
console.log('🔧 Configuración de BD:', {
    entorno: isProduction ? '🚀 PRODUCCIÓN (Railway)' : '💻 DESARROLLO (Local)',
    host: dbConfig.host,
    database: dbConfig.database,
    port: dbConfig.port,
    user: dbConfig.user
});

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Convertir a promesas para usar async/await
const promisePool = pool.promise();

// Función para verificar conexión
const testConnection = async () => {
    try {
        const [rows] = await promisePool.query('SELECT 1');
        console.log('✅ Conexión a MySQL exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        return false;
    }
};

module.exports = {
    pool: promisePool,
    testConnection
};