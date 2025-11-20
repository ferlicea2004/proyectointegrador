// screens/DetalleProductoScreen.js
// Pantalla con información detallada del producto

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useCarrito } from '../contexts/CarritoContext';
import { useFavoritos } from '../contexts/FavoritosContext';
import { useTheme } from '../contexts/ThemeContext';
import productImages from '../assets/images/productimages';

export default function DetalleProductoScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { producto } = route.params;
  const { agregarAlCarrito, cantidadTotal } = useCarrito();
  const { toggleFavorito, esFavorito } = useFavoritos();
  
  const [cantidad, setCantidad] = useState(1);
  const esFav = esFavorito(producto.id);

  const handleAgregarCarrito = () => {
    if (producto.stock === 0) {
      Alert.alert('Sin Stock', 'Este producto está agotado');
      return;
    }

    if (cantidad > producto.stock) {
      Alert.alert('Stock Insuficiente', `Solo hay ${producto.stock} disponibles`);
      return;
    }

    agregarAlCarrito(producto, cantidad);
    Alert.alert(
      '¡Agregado! 🛒',
      `${cantidad}x ${producto.nombre} agregado al carrito`,
      [
        { text: 'Seguir comprando', style: 'cancel' },
        { text: 'Ver carrito', onPress: () => navigation.navigate('MainTabs', { screen: 'Carrito' }) },
      ]
    );
  };

  const handleToggleFavorito = () => {
    const resultado = toggleFavorito(producto);
    if (resultado) {
      Alert.alert('⭐ Favorito', 'Agregado a favoritos');
    } else {
      Alert.alert('Favorito eliminado', 'Quitado de favoritos');
    }
  };

  const incrementar = () => {
    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  };

  const decrementar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const precio = Number(producto.precio) || 0;
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleFavorito} style={styles.favButton}>
          <Text style={styles.favIcon}>{esFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Imagen */}
        <View style={styles.imageContainer}>
          {!!producto.destacado && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⭐ Destacado</Text>
            </View>
          )}
          {producto.imagen ? (
  productImages[producto.imagen] ? (
    <Image
      source={productImages[producto.imagen]}
      style={styles.productImage}
      resizeMode="contain"
    />
  ) : (
    <Image
      source={{ uri: `http://192.168.1.89:3000/uploads/productos/${producto.imagen}` }}
      style={styles.productImage}
      resizeMode="contain"
    />
  )
) : (
  <Text style={styles.imagePlaceholder}>📦</Text>
)}
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.categoria}>{producto.categoria}</Text>
          <Text style={styles.nombre}>{producto.nombre}</Text>
          
          {producto.descripcion && (
            <Text style={styles.descripcion}>{producto.descripcion}</Text>
          )}

          {/* Precio */}
          <View style={styles.precioContainer}>
            <Text style={styles.precio}>${precio.toFixed(2)}</Text>
            {producto.stock === 0 ? (
              <View style={styles.stockBadge}>
                <Text style={styles.stockOutText}>Agotado</Text>
              </View>
            ) : producto.stock <= 3 ? (
              <View style={styles.stockBadge}>
                <Text style={styles.stockLowText}>¡Solo quedan {String(producto.stock)}!</Text>
              </View>
            ) : (
              <View style={styles.stockBadge}>
                <Text style={styles.stockInText}>✓ Disponible</Text>
              </View>
            )}
          </View>

          {/* Selector de cantidad */}
          {producto.stock > 0 && (
            <View style={styles.cantidadContainer}>
              <Text style={styles.cantidadLabel}>Cantidad:</Text>
              <View style={styles.cantidadSelector}>
                <TouchableOpacity 
                  onPress={decrementar} 
                  style={styles.cantidadButton}
                  disabled={cantidad <= 1}
                >
                  <Text style={[styles.cantidadButtonText, cantidad <= 1 && styles.cantidadButtonDisabled]}>−</Text>
                </TouchableOpacity>
                
                <Text style={styles.cantidadText}>{String(cantidad)}</Text>
                
                <TouchableOpacity 
                  onPress={incrementar} 
                  style={styles.cantidadButton}
                  disabled={cantidad >= producto.stock}
                >
                  <Text style={[styles.cantidadButtonText, cantidad >= producto.stock && styles.cantidadButtonDisabled]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Subtotal */}
          {producto.stock > 0 && (
            <View style={styles.subtotalContainer}>
              <Text style={styles.subtotalLabel}>Subtotal:</Text>
              <Text style={styles.subtotalPrecio}>${(precio * cantidad).toFixed(2)}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer con botones */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, producto.stock === 0 && styles.addButtonDisabled]}
          onPress={handleAgregarCarrito}
          disabled={producto.stock === 0}
        >
          <Text style={styles.addButtonText}>
            {producto.stock === 0 ? 'Sin Stock' : '🛒 Agregar al Carrito'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
  },
  favButton: {
    padding: 8,
  },
  favIcon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    backgroundColor: theme.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  badgeText: {
    color: '#0A0A0A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    fontSize: 100,
  },
  infoContainer: {
    padding: 20,
  },
  categoria: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nombre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  precioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  precio: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.primary,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.backgroundTertiary,
  },
  stockInText: {
    color: theme.success,
    fontSize: 14,
    fontWeight: '600',
  },
  stockLowText: {
    color: theme.warning,
    fontSize: 14,
    fontWeight: '600',
  },
  stockOutText: {
    color: theme.error,
    fontSize: 14,
    fontWeight: '600',
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cantidadLabel: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '600',
  },
  cantidadSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundTertiary,
    borderRadius: 12,
    padding: 4,
  },
  cantidadButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  cantidadButtonText: {
    fontSize: 24,
    color: theme.primary,
    fontWeight: 'bold',
  },
  cantidadButtonDisabled: {
    color: theme.textTertiary,
  },
  cantidadText: {
    fontSize: 20,
    color: theme.text,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  subtotalLabel: {
    fontSize: 18,
    color: theme.textTertiary,
    fontWeight: '600',
  },
  subtotalPrecio: {
    fontSize: 24,
    color: theme.text,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: theme.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  addButton: {
    backgroundColor: theme.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: theme.backgroundTertiary,
  },
  addButtonText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});