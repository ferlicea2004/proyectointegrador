// screens/EstadisticasAdminScreen.js
// Panel de estadísticas y métricas del negocio

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function EstadisticasAdminScreen({ navigation }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [estadisticas, setEstadisticas] = useState({
    ventasTotales: 0,
    totalPedidos: 0,
    totalProductos: 0,
    totalClientes: 0,
    pedidosPendientes: 0,
    pedidosCompletados: 0,
    pedidosCancelados: 0,
    ventasMes: 0,
    nuevosClientesMes: 0,
    productosTopVendidos: [],
    productosBajoStock: [],
  });

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const productosRes = await api.getProductos();
      const productos = productosRes.success ? productosRes.data : [];
      const totalProductos = productos.length;
      
      const productosBajoStock = productos.filter(p => p.stock <= 1);

      const pedidosRes = await api.getPedidos();
      const pedidos = pedidosRes.success ? pedidosRes.data : [];
      const totalPedidos = pedidos.length;

      const pedidosPendientes = pedidos.filter(p => p.estado?.toLowerCase() === 'pendiente').length;
      const pedidosCompletados = pedidos.filter(p => p.estado?.toLowerCase() === 'completado').length;
      const pedidosCancelados = pedidos.filter(p => p.estado?.toLowerCase() === 'cancelado').length;

      const ventasTotales = pedidos
        .filter(p => p.estado?.toLowerCase() === 'completado')
        .reduce((sum, p) => sum + Number(p.total), 0);

      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const ventasMes = pedidos
        .filter(p => {
          const fecha = new Date(p.fecha_creacion);
          return p.estado?.toLowerCase() === 'completado' && fecha >= inicioMes;
        })
        .reduce((sum, p) => sum + Number(p.total), 0);

      const clientesRes = await api.obtenerClientes();
      const clientes = clientesRes.success ? clientesRes.data : [];
      const totalClientes = clientes.length;

      const nuevosClientesMes = clientes.filter(c => {
        const fecha = new Date(c.fecha_registro);
        return fecha >= inicioMes;
      }).length;

      // Top 3 productos destacados
const productosTopVendidos = productos
  .filter(p => p.destacado === 1)
  .slice(0, 3);

      setEstadisticas({
        ventasTotales,
        totalPedidos,
        totalProductos,
        totalClientes,
        pedidosPendientes,
        pedidosCompletados,
        pedidosCancelados,
        ventasMes,
        nuevosClientesMes,
        productosTopVendidos,
        productosBajoStock,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarEstadisticas();
  };

  const formatearMoneda = (valor) => {
    if (valor >= 1000) {
      return `$${(valor / 1000).toFixed(1)}K`;
    }
    return `$${valor.toFixed(0)}`;
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Estadísticas</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.refreshButton}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Resumen General</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: '#34C759' }]}>
              <Text style={styles.statNumber}>
                {formatearMoneda(estadisticas.ventasTotales)}
              </Text>
              <Text style={styles.statLabel}>Ventas Totales</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#007AFF' }]}>
              <Text style={styles.statNumber}>
                {String(estadisticas.totalPedidos)}
              </Text>
              <Text style={styles.statLabel}>Pedidos</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#FF9500' }]}>
              <Text style={styles.statNumber}>
                {String(estadisticas.totalProductos)}
              </Text>
              <Text style={styles.statLabel}>Productos</Text>
            </View>

            <View style={[styles.statCard, { borderLeftColor: '#AF52DE' }]}>
              <Text style={styles.statNumber}>
                {String(estadisticas.totalClientes)}
              </Text>
              <Text style={styles.statLabel}>Clientes</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Este Mes</Text>
          
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { flex: 1, borderLeftColor: '#34C759' }]}>
              <Text style={styles.statNumber}>
                {formatearMoneda(estadisticas.ventasMes)}
              </Text>
              <Text style={styles.statLabel}>Ventas</Text>
            </View>

            <View style={[styles.statCard, { flex: 1, borderLeftColor: '#5856D6' }]}>
              <Text style={styles.statNumber}>
                {String(estadisticas.nuevosClientesMes)}
              </Text>
              <Text style={styles.statLabel}>Nuevos Clientes</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Estado de Pedidos</Text>
          
          <View style={styles.pedidosCard}>
            <View style={styles.pedidoRow}>
              <View style={styles.pedidoInfo}>
                <View style={[styles.pedidoDot, { backgroundColor: '#FF9500' }]} />
                <Text style={styles.pedidoLabel}>Pendientes</Text>
              </View>
              <Text style={styles.pedidoValor}>
                {String(estadisticas.pedidosPendientes)}
              </Text>
            </View>

            <View style={styles.pedidoRow}>
              <View style={styles.pedidoInfo}>
                <View style={[styles.pedidoDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.pedidoLabel}>Completados</Text>
              </View>
              <Text style={styles.pedidoValor}>
                {String(estadisticas.pedidosCompletados)}
              </Text>
            </View>

            <View style={styles.pedidoRow}>
              <View style={styles.pedidoInfo}>
                <View style={[styles.pedidoDot, { backgroundColor: '#FF3B30' }]} />
                <Text style={styles.pedidoLabel}>Cancelados</Text>
              </View>
              <Text style={styles.pedidoValor}>
                {String(estadisticas.pedidosCancelados)}
              </Text>
            </View>

            {(estadisticas.pedidosPendientes > 0 || estadisticas.pedidosCompletados > 0 || estadisticas.pedidosCancelados > 0) && (
              <View style={styles.progressBar}>
                {estadisticas.pedidosPendientes > 0 && (
                  <View
                    style={[
                      styles.progressSegment,
                      {
                        flex: estadisticas.pedidosPendientes,
                        backgroundColor: '#FF9500',
                      },
                    ]}
                  />
                )}
                {estadisticas.pedidosCompletados > 0 && (
                  <View
                    style={[
                      styles.progressSegment,
                      {
                        flex: estadisticas.pedidosCompletados,
                        backgroundColor: '#34C759',
                      },
                    ]}
                  />
                )}
                {estadisticas.pedidosCancelados > 0 && (
                  <View
                    style={[
                      styles.progressSegment,
                      {
                        flex: estadisticas.pedidosCancelados,
                        backgroundColor: '#FF3B30',
                      },
                    ]}
                  />
                )}
              </View>
            )}
          </View>
        </View>

        {estadisticas.productosBajoStock.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚠️ Productos con Bajo Stock</Text>
            
            <View style={styles.alertCard}>
              <Text style={styles.alertText}>
                {String(estadisticas.productosBajoStock.length)} producto{estadisticas.productosBajoStock.length !== 1 ? 's' : ''} con menos de 5 unidades
              </Text>
              
              {estadisticas.productosBajoStock.slice(0, 5).map((producto) => (
                <View key={`producto-${producto.id}`} style={styles.productoRow}>
                  <Text style={styles.productoNombre} numberOfLines={1}>
                    {producto.nombre}
                  </Text>
                  <Text style={styles.productoStock}>
                    Stock: {String(producto.stock)}
                  </Text>
                </View>
              ))}

              {estadisticas.productosBajoStock.length > 5 && (
                <Text style={styles.masProductos}>
                  +{String(estadisticas.productosBajoStock.length - 5)} más
                </Text>
              )}
            </View>
          </View>
        )}

        {estadisticas.productosTopVendidos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Top 3 Productos</Text>
            
            <View style={styles.topCard}>
              {estadisticas.productosTopVendidos.map((producto, index) => (
                <View key={`top-${producto.id}`} style={styles.topRow}>
                  <View style={styles.topRank}>
                    <Text style={styles.topRankText}>{String(index + 1)}</Text>
                  </View>
                  <View style={styles.topInfo}>
                    <Text style={styles.topNombre} numberOfLines={1}>
                      {producto.nombre}
                    </Text>
                    <Text style={styles.topPrecio}>
                      ${Number(producto.precio).toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.topStock}>
                    Stock: {String(producto.stock)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 14,
      color: theme.textTertiary,
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
    refreshButton: {
      fontSize: 20,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 15,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 15,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderWidth: 1,
      borderColor: theme.border,
      minWidth: '48%',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 5,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    pedidosCard: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    pedidoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    pedidoInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    pedidoDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 10,
    },
    pedidoLabel: {
      fontSize: 14,
      color: theme.text,
    },
    pedidoValor: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
    },
    progressBar: {
      flexDirection: 'row',
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
      marginTop: 8,
    },
    progressSegment: {
      height: '100%',
    },
    alertCard: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      borderLeftWidth: 4,
      borderLeftColor: '#FF9500',
    },
    alertText: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 12,
      fontWeight: '600',
    },
    productoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    productoNombre: {
      flex: 1,
      fontSize: 13,
      color: theme.textSecondary,
    },
    productoStock: {
      fontSize: 13,
      fontWeight: '600',
      color: '#FF9500',
    },
    masProductos: {
      fontSize: 12,
      color: theme.textTertiary,
      marginTop: 8,
      fontStyle: 'italic',
    },
    topCard: {
      backgroundColor: theme.card,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    topRank: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    topRankText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#0A0A0A',
    },
    topInfo: {
      flex: 1,
    },
    topNombre: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    topPrecio: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    topStock: {
      fontSize: 12,
      color: theme.textTertiary,
    },
  });