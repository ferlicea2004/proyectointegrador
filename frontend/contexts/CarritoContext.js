// contexts/CarritoContext.js
// Maneja el estado global del carrito

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  // Cargar carrito desde AsyncStorage al iniciar
  useEffect(() => {
    cargarCarrito();
  }, []);

  // Guardar carrito en AsyncStorage cada vez que cambie
  useEffect(() => {
    guardarCarrito();
  }, [carrito]);

  const cargarCarrito = async () => {
  try {
    const carritoGuardado = await AsyncStorage.getItem('carrito');
    if (carritoGuardado) {
      const carritoParseado = JSON.parse(carritoGuardado);
      
      // ← LIMPIAR DATOS ANTIGUOS SIN TIPO
      const carritoLimpio = carritoParseado.map(item => ({
        ...item,
        tipo: item.tipo || 'minoreo' // Si no tiene tipo, asumir minoreo
      }));
      
      setCarrito(carritoLimpio);
    }
  } catch (error) {
    console.error('Error cargando carrito:', error);
  }
};

  const guardarCarrito = async () => {
    try {
      await AsyncStorage.setItem('carrito', JSON.stringify(carrito));
    } catch (error) {
      console.error('Error guardando carrito:', error);
    }
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
      // Si ya existe, aumentar cantidad
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ));
    } else {
      // Si no existe, agregarlo
      setCarrito([...carrito, { ...producto, cantidad }]);
    }
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.id !== productoId));
  };

  // Actualizar cantidad de un producto
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
    } else {
      setCarrito(carrito.map(item =>
        item.id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ));
    }
  };

  // Vaciar carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((total, item) => {
      const precio = Number(item.precio) || 0;
      return total + (precio * item.cantidad);
    }, 0);
  };

  // Obtener cantidad total de productos
  const cantidadTotal = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    calcularTotal,
    cantidadTotal,
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};