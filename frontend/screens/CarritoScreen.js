// screens/CarritoScreen.js
// Pantalla del carrito de compras funcional

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useCarrito } from '../contexts/CarritoContext';
import { useTheme } from '../contexts/ThemeContext';
import productImages from '../assets/images/productimages';
import { useUser } from '../contexts/UserContext';
import ChatbotButton from '../components/ChatbotButton';
import { getProductImageSource } from '../utils/imageHelper';

export default function CarritoScreen({ navigation }) {
  const { theme } = useTheme();
  const { carrito, eliminarDelCarrito, actualizarCantidad, calcularTotal, vaciarCarrito } = useCarrito();
  const { isGuest } = useUser();

  const handleEliminar = (producto) => {
    Alert.alert(
      'Eliminar producto',
      `¿Quitar ${producto.nombre} del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => eliminarDelCarrito(producto.id),
        },
      ]
    );
  };

  const handleVaciarCarrito = () => {
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de eliminar todos los productos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Vaciar',
          style: 'destructive',
          onPress: vaciarCarrito,
        },
      ]
    );
  };

  const handleHacerPedido = () => {
  if (carrito.length === 0) {
    Alert.alert('Carrito vacío', 'Agrega productos antes de hacer un pedido');
    return;
  }

  // Verificar si está logueado
  if (isGuest) {
    Alert.alert(
      '🔐 Inicia sesión',
      'Necesitas crear una cuenta o iniciar sesión para hacer un pedido',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Registrarme', 
          onPress: () => navigation.navigate('Auth')
        },
        { 
          text: 'Iniciar sesión', 
          onPress: () => navigation.navigate('ClientLogin')
        },
      ]
    );
    return;
  }

  navigation.navigate('Checkout');
};
  const total = calcularTotal();
  const styles = createStyles(theme);

  if (carrito.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🛒 Mi Carrito</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>Agrega productos desde la tienda</Text>
          
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Tienda')}
          >
            <Text style={styles.shopButtonText}>Ir a la Tienda</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Mi Carrito</Text>
        <TouchableOpacity onPress={handleVaciarCarrito}>
          <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de productos */}
      <ScrollView style={styles.content}>
        {carrito.map((item) => {
          const precio = Number(item.precio) || 0;
          const subtotal = precio * item.cantidad;
          const stockDisponible = item.stock || 0;

          return (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.productImage}>
                {item.imagen ? (
  <Image
    source={getProductImageSource(item.imagen)}
    style={styles.productImage}
    resizeMode="contain"
  />
) : (
  <Text style={styles.productImagePlaceholder}>📦</Text>
)}
              </View>

              <View style={styles.productInfo}>
                <View style={styles.productNameContainer}>
                  <Text style={styles.productName} numberOfLines={2}>{item.nombre}</Text>
                  {item.tipo === 'mayoreo' && (
                    <View style={styles.mayoreoTag}>
                      <Text style={styles.mayoreoTagText}>MAYOREO</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.productCategory}>{item.categoria}</Text>
                <Text style={styles.productPrice}>${precio.toFixed(2)} c/u</Text>

                {/* Selector de cantidad */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>{item.cantidad}</Text>

                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      item.tipo !== 'mayoreo' && item.cantidad >= stockDisponible && styles.quantityButtonDisabled
                    ]}
                    onPress={() => {
                      if (item.tipo === 'mayoreo') {
                        actualizarCantidad(item.id, item.cantidad + 1);
                      } else {
                        if (item.cantidad < stockDisponible) {
                          actualizarCantidad(item.id, item.cantidad + 1);
                        } else {
                          Alert.alert(
                            'Stock insuficiente',
                            `Solo hay ${stockDisponible} disponibles de este producto`
                          );
                        }
                      }
                    }}
                    disabled={item.tipo !== 'mayoreo' && item.cantidad >= stockDisponible}
                  >
                    <Text style={[
                      styles.quantityButtonText,
                      item.tipo !== 'mayoreo' && item.cantidad >= stockDisponible && styles.quantityButtonTextDisabled
                    ]}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Advertencia de stock */}
                {item.tipo !== 'mayoreo' && item.cantidad >= stockDisponible && (
                  <Text style={styles.stockWarning}>
                    ⚠️ Stock máximo alcanzado
                  </Text>
                )}
              </View>

              <View style={styles.productRight}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleEliminar(item)}
                >
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>

                <Text style={styles.subtotal}>${subtotal.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer con total */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={handleHacerPedido}>
          <Text style={styles.checkoutButtonText}>Hacer Pedido</Text>
        </TouchableOpacity>
      </View>
      <ChatbotButton />
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: theme.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  clearText: {
    fontSize: 14,
    color: theme.error,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  productImage: {
    width: 70,
    height: 70,
    backgroundColor: theme.backgroundTertiary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productImagePlaceholder: {
    fontSize: 30,
  },
  productImageReal: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  mayoreoTag: {
    backgroundColor: theme.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  mayoreoTagText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0A0A0A',
    letterSpacing: 0.5,
  },
  productCategory: {
    fontSize: 11,
    color: theme.textTertiary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    color: theme.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundTertiary,
    borderRadius: 8,
    alignSelf: 'flex-start',
    padding: 2,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  quantityButtonDisabled: {
    backgroundColor: theme.backgroundTertiary,
    opacity: 0.5,
  },
  quantityButtonText: {
    fontSize: 18,
    color: theme.primary,
    fontWeight: 'bold',
  },
  quantityButtonTextDisabled: {
    color: theme.textTertiary,
  },
  stockWarning: {
    fontSize: 10,
    color: theme.warning,
    marginTop: 5,
    fontStyle: 'italic',
  },
  quantityText: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  productRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 20,
  },
  subtotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.textTertiary,
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: theme.backgroundSecondary,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    color: theme.text,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primary,
  },
  checkoutButton: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});