// screens/HistorialClienteScreen.js
// Pantalla para ver el historial de pedidos de un cliente específico

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

export default function HistorialClienteScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { cliente } = route.params;
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const response = await api.obtenerPedidosCliente(cliente.id);
      
      if (response.success) {
        setPedidos(response.data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los pedidos');
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const verDetallePedido = (pedido) => {
    Alert.alert(
      `Pedido ${pedido.numero_pedido}`,
      `Estado: ${getEstadoTexto(pedido.estado)}\n` +
      `Total: $${Number(pedido.total).toFixed(2)}\n` +
      `Productos: ${pedido.total_productos}\n` +
      `Fecha: ${formatearFecha(pedido.fecha_creacion)}`,
      [{ text: 'OK' }]
    );
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Cargando historial...</Text>
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
        <Text style={styles.headerTitle}>Historial</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Info del cliente */}
      <View style={styles.clienteInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {cliente.nombre.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.clienteTexto}>
          <Text style={styles.clienteNombre}>{cliente.nombre}</Text>
          <Text style={styles.clienteEmail}>{cliente.email}</Text>
          <View style={styles.clienteStats}>
            <Text style={styles.statItem}>
              📦 {cliente.total_pedidos || 0} pedidos
            </Text>
            <Text style={styles.statItem}>
              💰 ${Number(cliente.total_gastado || 0).toFixed(2)} total
            </Text>
          </View>
        </View>
      </View>

      {pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Sin pedidos</Text>
          <Text style={styles.emptyText}>
            Este cliente aún no ha realizado ningún pedido
          </Text>
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
          <View style={styles.pedidosContainer}>
            <Text style={styles.resultadosText}>
              {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''} realizado{pedidos.length !== 1 ? 's' : ''}
            </Text>

            {pedidos.map((pedido) => (
              <TouchableOpacity
                key={pedido.id}
                style={styles.pedidoCard}
                onPress={() => verDetallePedido(pedido)}
              >
                {/* Header del pedido */}
                <View style={styles.pedidoHeader}>
                  <View>
                    <Text style={styles.numeroPedido}>{pedido.numero_pedido}</Text>
                    <Text style={styles.fechaPedido}>
                      {formatearFecha(pedido.fecha_creacion)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.estadoBadge,
                      { backgroundColor: getEstadoColor(pedido.estado) },
                    ]}
                  >
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

                {/* Flecha */}
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
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
    clienteInfo: {
      flexDirection: 'row',
      padding: 20,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    avatarText: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#0A0A0A',
    },
    clienteTexto: {
      flex: 1,
      justifyContent: 'center',
    },
    clienteNombre: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    clienteEmail: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    clienteStats: {
      flexDirection: 'row',
      gap: 15,
    },
    statItem: {
      fontSize: 12,
      color: theme.textTertiary,
      fontWeight: '600',
    },
    content: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      fontSize: 80,
      marginBottom: 15,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
    },
    emptyText: {
      fontSize: 14,
      color: theme.textTertiary,
      textAlign: 'center',
      paddingHorizontal: 40,
    },
    pedidosContainer: {
      padding: 15,
    },
    resultadosText: {
      fontSize: 14,
      color: theme.textTertiary,
      marginBottom: 15,
      fontWeight: '600',
    },
    pedidoCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
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
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    fechaPedido: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    estadoBadge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
    },
    estadoText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    pedidoInfo: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 12,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    infoLabel: {
      fontSize: 13,
      color: theme.textTertiary,
    },
    infoValue: {
      fontSize: 13,
      color: theme.text,
    },
    totalValue: {
      fontSize: 15,
      fontWeight: 'bold',
      color: theme.primary,
    },
    arrowContainer: {
      position: 'absolute',
      right: 16,
      top: '50%',
      marginTop: -12,
    },
    arrow: {
      fontSize: 24,
      color: theme.textTertiary,
    },
  });