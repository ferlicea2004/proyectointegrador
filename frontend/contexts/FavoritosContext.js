// contexts/FavoritosContext.js
// Maneja el estado global de favoritos

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritosContext = createContext();

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos debe usarse dentro de FavoritosProvider');
  }
  return context;
};

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);

  // Cargar favoritos al iniciar
  useEffect(() => {
    cargarFavoritos();
  }, []);

  // Guardar favoritos cada vez que cambien
  useEffect(() => {
    guardarFavoritos();
  }, [favoritos]);

  const cargarFavoritos = async () => {
    try {
      const favoritosGuardados = await AsyncStorage.getItem('favoritos');
      if (favoritosGuardados) {
        setFavoritos(JSON.parse(favoritosGuardados));
      }
    } catch (error) {
      console.error('Error cargando favoritos:', error);
    }
  };

  const guardarFavoritos = async () => {
    try {
      await AsyncStorage.setItem('favoritos', JSON.stringify(favoritos));
    } catch (error) {
      console.error('Error guardando favoritos:', error);
    }
  };

  // Agregar o quitar de favoritos (toggle)
  const toggleFavorito = (producto) => {
    const esFavorito = favoritos.some(item => item.id === producto.id);

    if (esFavorito) {
      // Quitar de favoritos
      setFavoritos(favoritos.filter(item => item.id !== producto.id));
      return false; // Retorna false = ya no es favorito
    } else {
      // Agregar a favoritos
      setFavoritos([...favoritos, producto]);
      return true; // Retorna true = ahora es favorito
    }
  };

  // Verificar si un producto es favorito
  const esFavorito = (productoId) => {
    return favoritos.some(item => item.id === productoId);
  };

  const value = {
    favoritos,
    toggleFavorito,
    esFavorito,
  };

  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};