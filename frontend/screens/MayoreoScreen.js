// screens/MayoreoScreen.js
// Pantalla de productos de mayoreo

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import api from '../services/api';
import productImages from '../assets/images/productimages';
import { useCarrito } from '../contexts/CarritoContext';
import { useTheme } from '../contexts/ThemeContext';
import ChatbotButton from '../components/ChatbotButton'; 

export default function MayoreoScreen({ navigation }) {  
  const { theme } = useTheme();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await api.getProductosMayoreo();
      if (response.success) {
        setProductos(response.data);
      }
    } catch (error) {
      console.error('Error cargando productos mayoreo:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarProductos();
  };

  const handleAgregarAlCarrito = (producto) => {
  // Si es paquete (cantidad_minima es igual al total de productos), agregar 1
  // Si NO es paquete, agregar la cantidad mínima
  const esPaquete = producto.nombre.toLowerCase().includes('paquete');
  const cantidadAAgregar = esPaquete ? 1 : (producto.cantidad_minima || 1);
  
  // Marcar como producto de mayoreo
  const productoMayoreo = {
    ...producto,
    tipo: 'mayoreo'
  };
  
  agregarAlCarrito(productoMayoreo, cantidadAAgregar);
    
  Alert.alert(
    '¡Agregado! 🛒',
    `${cantidadAAgregar}x ${producto.nombre} agregado al carrito`,
    [
      { text: 'Seguir comprando', style: 'cancel' },
      { text: 'Ver carrito', onPress: () => navigation.navigate('Carrito') },
    ]
  );
};

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(p => {
    if (busqueda.trim() === '') return true;
    return p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
           p.categoria.toLowerCase().includes(busqueda.toLowerCase());
  });

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Cargando productos mayoreo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.headerTitle}>MAYOREO</Text>
          <Text style={styles.headerSubtitle}>Precios especiales por volumen</Text>
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en mayoreo..."
            placeholderTextColor="#8E8E93"
            value={busqueda}
            onChangeText={setBusqueda}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {busqueda.length > 0 && (
            <TouchableOpacity 
              onPress={() => setBusqueda('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Productos */}
      <ScrollView
        style={styles.productsScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />
        }
      >
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>📦</Text>
          <View style={styles.infoBannerText}>
            <Text style={styles.infoBannerTitle}>Compra al mayoreo</Text>
            <Text style={styles.infoBannerSubtitle}>
              Precios especiales para revendedores
            </Text>
          </View>
        </View>

        {/* Política de mayoreo */}
        <View style={styles.policyBanner}>
          <Text style={styles.policyIcon}>ℹ️</Text>
          <View style={styles.policyText}>
            <Text style={styles.policyTitle}>Pedido mínimo: 6 productos</Text>
            <Text style={styles.policySubtitle}>
              Productos sobre pedido
            </Text>
          </View>
        </View>

        {/* Resultados de búsqueda */}
        {busqueda.length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsText}>
              {String(productosFiltrados.length)} resultado{productosFiltrados.length !== 1 ? 's' : ''} para "{busqueda}"
            </Text>
          </View>
        )}

        {/* Sin resultados */}
        {productosFiltrados.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsText}>
              No se encontraron productos
            </Text>
            <Text style={styles.noResultsSubtext}>
              Intenta con otro término de búsqueda
            </Text>
            <TouchableOpacity 
              style={styles.clearSearchButton}
              onPress={() => setBusqueda('')}
            >
              <Text style={styles.clearSearchButtonText}>Limpiar búsqueda</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {productosFiltrados.map((producto) => {
              const cantidadMin = producto.cantidad_minima || 1;
              const precioPaquete = Number(producto.precio) || 0;
              const esPaquete = producto.nombre.toLowerCase().includes('paquete');

              return (
                <View key={producto.id} style={styles.productCard}>
                  <View style={styles.mayoreoTag}>
                    <Text style={styles.mayoreoTagText}>
                      {producto.porcentaje_ahorro}% OFF
                    </Text>
                  </View>

                  <View style={styles.productImageContainer}>
                    {producto.imagen && productImages[producto.imagen] ? (
                      <Image
                        source={productImages[producto.imagen]}
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.productImagePlaceholder}>📦</Text>
                    )}
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {producto.nombre}
                    </Text>
                    <Text style={styles.productCategory}>{producto.categoria}</Text>
                    
                    <View style={styles.priceContainer}>
                      <View>
                        <Text style={styles.priceLabel}>{esPaquete ? 'Precio del paquete:' : 'Precio c/u:'}</Text>
                        <Text style={styles.productPrice}>
                          ${precioPaquete.toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.minQuantity}>
  <Text style={styles.minQuantityLabel}>Paquete:</Text>
  <Text style={styles.minQuantityValue}>{String(cantidadMin)} pzs</Text>
</View>
                    </View>

                    {producto.productos_incluidos && (
                      <View style={styles.includesContainer}>
                        <Text style={styles.includesLabel}>📦 Incluye:</Text>
                        <Text style={styles.includesText}>{producto.productos_incluidos}</Text>
                      </View>
                    )}

                    <TouchableOpacity 
  style={styles.addButton}
  onPress={() => handleAgregarAlCarrito(producto)}
>
  <Text style={styles.addButtonText}>
    {producto.nombre.toLowerCase().includes('paquete') 
      ? '🛒 Agregar al carrito'
      : `🛒 Agregar ${String(cantidadMin)} al carrito`
    }
  </Text>
</TouchableOpacity>

                    <Text style={styles.onDemandText}>
                      📋 Producto sobre pedido
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      <ChatbotButton />  
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.text,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: theme.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: theme.textTertiary,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: theme.background,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: theme.text,
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: theme.textTertiary,
    fontWeight: 'bold',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    alignItems: 'center',
  },
  infoBannerIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  infoBannerText: {
    flex: 1,
  },
  infoBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 2,
  },
  infoBannerSubtitle: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  searchResults: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchResultsText: {
    fontSize: 14,
    color: theme.textTertiary,
    fontStyle: 'italic',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  noResultsIcon: {
    fontSize: 60,
    marginBottom: 15,
    opacity: 0.5,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 20,
    textAlign: 'center',
  },
  clearSearchButton: {
    backgroundColor: theme.backgroundTertiary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  clearSearchButtonText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  productsScroll: {
    flex: 1,
  },
  productsGrid: {
    padding: 15,
  },
  productCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
  },
  mayoreoTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: theme.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    zIndex: 1,
  },
  mayoreoTagText: {
    color: '#0A0A0A',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  productImageContainer: {
    height: 180,
    backgroundColor: theme.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    fontSize: 60,
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 12,
    color: theme.textTertiary,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  priceLabel: {
    fontSize: 11,
    color: theme.textTertiary,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
  },
  minQuantity: {
    alignItems: 'flex-end',
  },
  minQuantityLabel: {
    fontSize: 11,
    color: theme.textTertiary,
    marginBottom: 2,
  },
  minQuantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: theme.backgroundTertiary,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 13,
    color: theme.textTertiary,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.primary,
  },
  addButton: {
    backgroundColor: theme.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#0A0A0A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  outOfStockButton: {
    backgroundColor: theme.backgroundTertiary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  outOfStockText: {
    color: theme.error,
    fontSize: 15,
    fontWeight: 'bold',
  },
  lowStock: {
    fontSize: 11,
    color: theme.warning,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  includesContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: theme.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  includesLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 5,
  },
  includesText: {
    fontSize: 11,
    color: theme.textSecondary,
    lineHeight: 16,
  },
  onDemandText: {
    fontSize: 11,
    color: theme.textTertiary,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  policyBanner: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
    alignItems: 'center',
  },
  policyIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  policyText: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 3,
  },
  policySubtitle: {
    fontSize: 12,
    color: theme.textTertiary,
  },
});