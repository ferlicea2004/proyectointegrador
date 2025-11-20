// services/api.js
// Servicio para comunicarse con el backend

import Constants from 'expo-constants';

// ← DETECCIÓN AUTOMÁTICA DE IP
// ← DETECCIÓN AUTOMÁTICA DE IP (versión mejorada)
const getApiUrl = () => {
  if (__DEV__) {
    // En desarrollo, detectar IP automáticamente desde Expo
    const { expoConfig } = Constants;
    
    if (expoConfig?.hostUri) {
      const ip = expoConfig.hostUri.split(':').shift();
      console.log('📡 IP detectada automáticamente (hostUri):', ip);
      return `http://${ip}:3000`;
    }
    
    const { manifest } = Constants;
    if (manifest?.debuggerHost) {
      const ip = manifest.debuggerHost.split(':').shift();
      console.log('📡 IP detectada automáticamente (debuggerHost):', ip);
      return `http://${ip}:3000`;
    }
    
    console.warn('⚠️ No se pudo detectar IP, usando fallback');
    return 'http://172.20.10.3:3000';
  }
  
  // ← EN PRODUCCIÓN, USA TU URL DE RAILWAY
  return 'https://kraken-store-backend-production.up.railway.app';
};

const API_BASE = getApiUrl();
const API_URL = `${API_BASE}/api`;

console.log('🌐 API Base URL:', API_BASE);
console.log('🔗 API URL:', API_URL);

// Exportar para usar en imágenes
export { API_BASE };

//IP de la casa 192.168.100.97
//IP con hotspot 172.20.10.3
//IP hotel diligencias 192.168.1.89

const api = {
  // Login de admin
  login: async (nombre, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, password }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Obtener todos los productos
  getProductos: async () => {
    try {
      const response = await fetch(`${API_URL}/productos`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  },

  // Obtener productos por categoría
  getProductosByCategoria: async (categoria) => {
    try {
      const response = await fetch(`${API_URL}/productos/categoria/${categoria}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error);
      throw error;
    }
  },

  // Obtener productos destacados
  getProductosDestacados: async () => {
    try {
      const response = await fetch(`${API_URL}/productos/destacados/list`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo productos destacados:', error);
      throw error;
    }
  },

  // Crear pedido
  createPedido: async (pedidoData) => {
    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoData),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creando pedido:', error);
      throw error;
    }
  },

  // Actualizar stock de producto
  actualizarStock: async (productoId, nuevoStock) => {
    try {
      const response = await fetch(`${API_URL}/productos/${productoId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: nuevoStock }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error actualizando stock:', error);
      throw error;
    }
  },

  // Actualizar precio de producto
  actualizarPrecio: async (productoId, nuevoPrecio) => {
    try {
      const response = await fetch(`${API_URL}/productos/${productoId}/precio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ precio: nuevoPrecio }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error actualizando precio:', error);
      throw error;
    }
  },

  // Toggle destacado
  toggleDestacado: async (productoId, destacado) => {
    try {
      const response = await fetch(`${API_URL}/productos/${productoId}/destacado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destacado }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error actualizando destacado:', error);
      throw error;
    }
  },

  // Obtener todos los pedidos
  getPedidos: async () => {
    try {
      const response = await fetch(`${API_URL}/pedidos`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo pedidos:', error);
      throw error;
    }
  },

  // Obtener detalle de un pedido
  getPedidoById: async (pedidoId) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo pedido:', error);
      throw error;
    }
  },

  // Obtener detalles de productos de un pedido
  getDetallePedido: async (pedidoId) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}`);
      const data = await response.json();
      
      if (data.success && data.data.productos) {
        return {
          success: true,
          data: data.data.productos
        };
      }
      
      return { success: false, data: [] };
    } catch (error) {
      console.error('Error obteniendo detalle pedido:', error);
      return { success: false, data: [] };
    }
  },

  // Cambiar estado de pedido
  cambiarEstadoPedido: async (pedidoId, nuevoEstado) => {
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error cambiando estado:', error);
      throw error;
    }
  },

  // Obtener paquetes de mayoreo
  getProductosMayoreo: async () => {
    try {
      const response = await fetch(`${API_URL}/productos/mayoreo`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo productos mayoreo:', error);
      throw error;
    }
  },

  // ============ CLIENTES ============
  
  // Registrar nuevo cliente
  registrarCliente: async (clienteData) => {
    try {
      const response = await fetch(`${API_URL}/clientes/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error registrando cliente:', error);
      throw error;
    }
  },

  // Login de cliente
  loginCliente: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/clientes/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en login cliente:', error);
      throw error;
    }
  },

  // Obtener perfil de cliente
  obtenerPerfilCliente: async (id) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      throw error;
    }
  },

  // Actualizar perfil de cliente
  actualizarPerfilCliente: async (id, clienteData) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  },

  // Obtener pedidos de un cliente
  obtenerPedidosCliente: async (clienteId) => {
    try {
      const response = await fetch(`${API_URL}/clientes/${clienteId}/pedidos`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo pedidos del cliente:', error);
      throw error;
    }
  },

  // Obtener todos los clientes
  obtenerClientes: async () => {
    try {
      const response = await fetch(`${API_URL}/clientes`);
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo clientes:', error);
      return { success: false, error: error.message };
    }
  },

  // Crear nuevo producto (con imagen)
  crearProducto: async (formData) => {
    try {
      const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error('Error creando producto:', error);
      return { success: false, error: error.message };
    }
  },
};

export default api;