// screens/GestionProductosScreen.js
// Pantalla para que admin gestione productos

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function GestionProductosScreen({ navigation }) {
  const { theme } = useTheme();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  // Recargar al volver a la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarProductos();
    });
    return unsubscribe;
  }, [navigation]);

  const cargarProductos = async () => {
    try {
      const response = await api.getProductos();
      if (response.success) {
        setProductos(response.data);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarProductos();
  };

  const actualizarStock = async (productoId, nuevoStock, operacion) => {
    try {
      const response = await api.actualizarStock(productoId, nuevoStock);
      
      if (response.success) {
        setProductos(productos.map(p => 
          p.id === productoId ? { ...p, stock: nuevoStock } : p
        ));
        
        Alert.alert('✅ Actualizado', `Stock ${operacion}`);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Error actualizando stock:', error);
      Alert.alert('Error', 'No se pudo actualizar el stock');
    }
  };

  const toggleDestacado = async (producto) => {
    try {
      const nuevoEstado = !producto.destacado;
      const response = await api.toggleDestacado(producto.id, nuevoEstado);
      
      if (response.success) {
        setProductos(productos.map(p => 
          p.id === producto.id ? { ...p, destacado: nuevoEstado } : p
        ));
        
        Alert.alert(
          '✅ Actualizado',
          nuevoEstado ? 'Producto marcado como destacado' : 'Producto desmarcado'
        );
      }
    } catch (error) {
      console.error('Error actualizando destacado:', error);
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  const actualizarPrecio = async (productoId, nuevoPrecio) => {
    try {
      const response = await api.actualizarPrecio(productoId, nuevoPrecio);
      
      if (response.success) {
        setProductos(productos.map(p => 
          p.id === productoId ? { ...p, precio: nuevoPrecio } : p
        ));
        setEditando(null);
        Alert.alert('✅ Actualizado', 'Precio modificado');
      }
    } catch (error) {
      console.error('Error actualizando precio:', error);
      Alert.alert('Error', 'No se pudo actualizar el precio');
    }
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestionar Productos</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor={theme.textTertiary}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Lista de productos */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        <Text style={styles.resultCount}>
          {String(productosFiltrados.length)} producto{productosFiltrados.length !== 1 ? 's' : ''}
        </Text>

        {productosFiltrados.map((producto) => {
          const precio = Number(producto.precio) || 0;
          const isEditandoPrecio = editando === producto.id;

          return (
            <View key={producto.id} style={styles.productCard}>
              {/* Info básica */}
              <View style={styles.productHeader}>
                <View style={styles.productTitleRow}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {producto.nombre}
                  </Text>
                  <TouchableOpacity
                    style={styles.starButton}
                    onPress={() => toggleDestacado(producto)}
                  >
                    <Text style={styles.starIcon}>
                      {producto.destacado ? '⭐' : '☆'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.productCategory}>{producto.categoria}</Text>
              </View>

              {/* Stock */}
              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Stock:</Text>
                <View style={styles.stockControls}>
                  <TouchableOpacity
                    style={styles.stockButton}
                    onPress={() => {
                      if (producto.stock > 0) {
                        actualizarStock(producto.id, producto.stock - 1, 'reducido');
                      }
                    }}
                    disabled={producto.stock === 0}
                  >
                    <Text style={[
                      styles.stockButtonText,
                      producto.stock === 0 && styles.stockButtonDisabled
                    ]}>−</Text>
                  </TouchableOpacity>

                  <Text style={[
                    styles.stockValue,
                    producto.stock === 0 && styles.stockZero,
                    producto.stock <= 3 && producto.stock > 0 && styles.stockLow
                  ]}>
                    {producto.stock}
                  </Text>

                  <TouchableOpacity
                    style={styles.stockButton}
                    onPress={() => actualizarStock(producto.id, producto.stock + 1, 'aumentado')}
                  >
                    <Text style={styles.stockButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Precio */}
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Precio:</Text>

                {isEditandoPrecio ? (
                  <View style={styles.priceEditContainer}>
                    <TextInput
                      style={styles.priceInput}
                      defaultValue={precio.toString()}
                      keyboardType="numeric"
                      onSubmitEditing={(e) => {
                        const nuevoPrecio = parseFloat(e.nativeEvent.text);
                        if (!isNaN(nuevoPrecio) && nuevoPrecio > 0) {
                          actualizarPrecio(producto.id, nuevoPrecio);
                        } else {
                          Alert.alert('Error', 'Precio inválido');
                          setEditando(null);
                        }
                      }}
                      onChangeText={(text) => {
                        producto._tempPrecio = text;
                      }}
                      autoFocus
                      returnKeyType="done"
                      blurOnSubmit={true}
                    />
                    <TouchableOpacity 
                      style={styles.confirmButton}
                      onPress={() => {
                        const nuevoPrecio = parseFloat(producto._tempPrecio || precio);
                        if (!isNaN(nuevoPrecio) && nuevoPrecio > 0) {
                          actualizarPrecio(producto.id, nuevoPrecio);
                        } else {
                          Alert.alert('Error', 'Precio inválido');
                          setEditando(null);
                        }
                      }}
                    >
                      <Text style={styles.confirmButtonText}>✓</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setEditando(null)}
                    >
                      <Text style={styles.cancelEdit}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => setEditando(producto.id)}>
                    <Text style={styles.priceValue}>
                      ${precio.toFixed(2)} ✏️
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Botón flotante para agregar producto */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('AgregarProducto')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: theme.background,
  },
  searchInput: {
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  resultCount: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  productHeader: {
    marginBottom: 12,
  },
  productTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    flex: 1,
    marginRight: 10,
  },
  starButton: {
    padding: 5,
  },
  starIcon: {
    fontSize: 24,
  },
  productCategory: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  stockLabel: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '500',
  },
  stockControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundTertiary,
    borderRadius: 8,
    padding: 3,
  },
  stockButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  stockButtonText: {
    fontSize: 20,
    color: theme.primary,
    fontWeight: 'bold',
  },
  stockButtonDisabled: {
    color: theme.textTertiary,
  },
  stockValue: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '600',
    marginHorizontal: 15,
    minWidth: 30,
    textAlign: 'center',
  },
  stockZero: {
    color: theme.error,
  },
  stockLow: {
    color: theme.warning,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 18,
    color: theme.primary,
    fontWeight: 'bold',
  },
  priceEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    backgroundColor: theme.backgroundTertiary,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: theme.text,
    width: 100,
    textAlign: 'center',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: theme.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 5,
  },
  confirmButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: theme.error,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelEdit: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#0A0A0A',
    fontWeight: 'bold',
  },
});