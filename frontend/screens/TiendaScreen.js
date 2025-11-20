// screens/TiendaScreen.js
// Pantalla principal de la tienda

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
} from 'react-native';
import api from '../services/api';
import productImages from '../assets/images/productimages';
import { useTheme } from '../contexts/ThemeContext';
import ChatbotButton from '../components/ChatbotButton';

const getStockStatus = (stock) => {
  if (stock === 0) {
    return { text: 'Agotado', styleKey: 'outOfStock' };
  }
  if (stock <= 3) {
    return { text: `¡Solo quedan ${stock}!`, styleKey: 'lowStock' };
  }
  return { text: 'Disponible', styleKey: 'inStock' };
}; 

export default function TiendaScreen({ navigation }) {  
  const { theme } = useTheme();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categoriaActual, setCategoriaActual] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const categorias = ['Todos', 'Audio', 'Relojes', 'Cargadores', 'Baterías', 'Proyectores', 'Accesorios'];

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await api.getProductos();
      if (response.success) {
        setProductos(response.data);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarProductos();
  };

  // Función para renderizar estado del stock
  const renderStockStatus = (stock, styles) => {
    if (stock === 0) {
      return <Text style={styles.outOfStock}>Agotado</Text>;
    }
    if (stock <= 3) {
      return <Text style={styles.lowStock}>¡Solo quedan {String(stock)}!</Text>;
    }
    return <Text style={styles.inStock}>Disponible</Text>;
  };

  // Filtrar productos por categoría Y búsqueda
  const productosFiltrados = productos.filter(p => {
    // Filtrar por categoría
    const cumpleCategoria = categoriaActual === 'Todos' 
      ? true 
      : p.categoria === categoriaActual;
    
    // Filtrar por búsqueda
    const cumpleBusqueda = busqueda.trim() === '' 
      ? true 
      : p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleCategoria && cumpleBusqueda;
  });

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>KRAKEN STORE</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
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

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              categoriaActual === cat && styles.categoryChipActive
            ]}
            onPress={() => setCategoriaActual(cat)}
          >
            <Text style={[
              styles.categoryText,
              categoriaActual === cat && styles.categoryTextActive
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.productsScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />
        }
      >
        {busqueda.length > 0 && (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsText}>
              {String(productosFiltrados.length)} resultado{productosFiltrados.length !== 1 ? 's' : ''} para "{String(busqueda)}"
            </Text>
          </View>
        )}

        {productosFiltrados.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsText}>
              {busqueda.length > 0 
                ? 'No se encontraron productos'
                : 'No hay productos en esta categoría'}
            </Text>
            {busqueda.length > 0 && (
              <>
                <Text style={styles.noResultsSubtext}>
                  Intenta con otro término de búsqueda
                </Text>
                <TouchableOpacity 
                  style={styles.clearSearchButton}
                  onPress={() => setBusqueda('')}
                >
                  <Text style={styles.clearSearchButtonText}>Limpiar búsqueda</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {productosFiltrados.map((producto) => {
              const status = getStockStatus(producto.stock);
              return (
                <TouchableOpacity
                  key={producto.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('DetalleProducto', { producto })}
                >
                  {!!producto.destacado && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>⭐ Destacado</Text>
                    </View>
                  )}
                  
                  <View style={styles.productImageContainer}>
  {producto.imagen ? (
    productImages[producto.imagen] ? (
      // Imagen local (productos viejos)
      <Image
        source={productImages[producto.imagen]}
        style={styles.productImage}
        resizeMode="contain"
      />
    ) : (
      // Imagen del servidor (productos nuevos)
      <Image
        source={{ uri: `http://192.168.1.89:3000/uploads/productos/${producto.imagen}` }}
        style={styles.productImage}
        resizeMode="contain"
      />
    )
  ) : (
    <Text style={styles.productImagePlaceholder}>📦</Text>
  )}
</View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {producto.nombre}
                    </Text>
                    <Text style={styles.productCategory}>{producto.categoria}</Text>
                    <Text style={styles.productPrice}>
                      ${producto.precio ? Number(producto.precio).toFixed(2) : '0.00'}
                    </Text>
                    <Text style={styles[status.styleKey]}>{status.text}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
      <ChatbotButton /> 
    </View>
  );
}

// ← FUNCIÓN createStyles AL FINAL
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
  categoriesContainer: {
    maxHeight: 60,
    backgroundColor: theme.background,
  },
  categoriesContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.backgroundSecondary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  categoryChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  categoryText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#0A0A0A',
  },
  productsScroll: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: theme.card,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: theme.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeText: {
    color: '#0A0A0A',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productImageContainer: {
    height: 150,
    backgroundColor: theme.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    fontSize: 50,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 5,
    height: 40,
  },
  productCategory: {
    fontSize: 11,
    color: theme.textTertiary,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 8,
  },
  inStock: {
    fontSize: 11,
    color: theme.success,
  },
  lowStock: {
    fontSize: 11,
    color: theme.warning,
    fontWeight: '600',
  },
  outOfStock: {
    fontSize: 11,
    color: theme.error,
  },
});