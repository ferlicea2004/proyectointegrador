// screens/MisPedidosScreen.js
// Pantalla de historial de pedidos del usuario

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
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function MisPedidosScreen({ navigation }) {
  const { theme } = useTheme();
  const { user } = useUser();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      if (!user || !user.id) {
        Alert.alert('Error', 'No se pudo obtener la información del usuario');
        return;
      }

      const response = await api.obtenerPedidosCliente(user.id);
      
      if (response.success) {
        setPedidos(response.data);
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      Alert.alert('Error', 'No se pudieron cargar tus pedidos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarPedidos();
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return theme.warning;
      case 'completado':
        return theme.success;
      case 'cancelado':
        return theme.error;
      default:
        return theme.textTertiary;
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
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
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
        <View style={{ width: 60 }} />
      </View>

      {pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Sin pedidos aún</Text>
          <Text style={styles.emptyText}>
            Tus pedidos aparecerán aquí una vez que realices tu primera compra
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Tienda' })}
          >
            <Text style={styles.shopButtonText}>Ir a la tienda</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} realizado{pedidos.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {pedidos.map((pedido) => (
            <View key={pedido.id} style={styles.pedidoCard}>
              {/* Header del pedido */}
              <View style={styles.pedidoHeader}>
                <View>
                  <Text style={styles.numeroPedido}>{pedido.numero_pedido}</Text>
                  <Text style={styles.fechaPedido}>
                    {formatearFecha(pedido.fecha_creacion)}
                  </Text>
                </View>
                <View style={[
                  styles.estadoBadge,
                  { backgroundColor: getEstadoColor(pedido.estado) }
                ]}>
                  <Text style={styles.estadoText}>
                    {getEstadoTexto(pedido.estado)}
                  </Text>
                </View>
              </View>

              {/* Info del pedido */}
              <View style={styles.pedidoInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Productos:</Text>
                  <Text style={styles.infoValue}>
                    {pedido.total_productos} artículo{pedido.total_productos !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Total:</Text>
                  <Text style={styles.totalValue}>
                    ${Number(pedido.total).toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Botón ver detalles */}
              <TouchableOpacity
                style={styles.verDetallesButton}
                onPress={() => {
                  Alert.alert(
                    'Detalles del pedido',
                    `Pedido: ${pedido.numero_pedido}\nEstado: ${getEstadoTexto(pedido.estado)}\nTotal: $${Number(pedido.total).toFixed(2)}`,
                    [{ text: 'OK' }]
                  );
                }}
              >
                <Text style={styles.verDetallesText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: theme.textTertiary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  shopButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  shopButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    padding: 20,
    backgroundColor: theme.card,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '600',
  },
  pedidoCard: {
    backgroundColor: theme.card,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  numeroPedido: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  fechaPedido: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pedidoInfo: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 15,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  infoValue: {
    fontSize: 14,
    color: theme.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary,
  },
  verDetallesButton: {
    backgroundColor: theme.backgroundTertiary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  verDetallesText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});