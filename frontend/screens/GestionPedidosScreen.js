// screens/GestionPedidosScreen.js
// Pantalla para que admin vea y gestione pedidos

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import api from '../services/api';

export default function GestionPedidosScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtro, setFiltro] = useState('todos'); // todos, pendiente, completado, cancelado

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const response = await api.getPedidos();
      if (response.success) {
        setPedidos(response.data);
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      Alert.alert('Error', 'No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarPedidos();
  };

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      const response = await api.cambiarEstadoPedido(pedidoId, nuevoEstado);
      
      if (response.success) {
        // Actualizar localmente
        setPedidos(pedidos.map(p => 
          p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
        ));
        
        Alert.alert('✅ Actualizado', `Pedido marcado como ${nuevoEstado}`);
      } else {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  const confirmarCambioEstado = (pedido, nuevoEstado) => {
    const mensajes = {
      pendiente: '¿Marcar como pendiente?',
      completado: '¿Marcar como completado?',
      cancelado: '¿Cancelar este pedido?',
    };

    Alert.alert(
      'Cambiar estado',
      mensajes[nuevoEstado],
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: nuevoEstado === 'cancelado' ? 'destructive' : 'default',
          onPress: () => cambiarEstado(pedido.id, nuevoEstado),
        },
      ]
    );
  };

  const verDetallePedido = async (pedido) => {
  try {
    // Obtener detalles del pedido
    const response = await api.getPedidoById(pedido.id);
    
    if (response.success) {
      const detalles = response.data;
      
      // Crear mensaje con los productos
      let productosTexto = detalles.productos.map((p, index) => 
        `${index + 1}. ${p.nombre}\n   ${p.cantidad}x $${Number(p.precio_unitario).toFixed(2)} = $${(p.cantidad * p.precio_unitario).toFixed(2)}`
      ).join('\n\n');

      // Mostrar alert con detalles
Alert.alert(
  `📦 Pedido ${pedido.numero_pedido}`,
  `Cliente: ${pedido.cliente_nombre}\n${pedido.telefono ? '📱: ' + pedido.telefono : ''}\n\n───────────────\nPRODUCTOS:\n───────────────\n\n${productosTexto}\n\n───────────────\nTotal: $${Number(pedido.total).toFixed(2)}${pedido.notas ? '\n\n───────────────\n📝 NOTAS:\n───────────────\n' + pedido.notas : ''}`,
  [{ text: 'Cerrar' }]
);
    }
  } catch (error) {
    Alert.alert('Error', 'No se pudieron cargar los detalles');
  }
};

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtro === 'todos') return true;
    return p.estado.toLowerCase() === filtro.toLowerCase();
});

  const getEstadoColor = (estado) => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
    case 'pendiente': return '#FF9500';
    case 'completado': return '#34C759';
    case 'cancelado': return '#FF3B30';
    default: return '#8E8E93';
    }
};

  const getEstadoIcon = (estado) => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
    case 'pendiente': return '⏳';
    case 'completado': return '✅';
    case 'cancelado': return '❌';
    default: return '📦';
    }
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
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
        <Text style={styles.headerTitle}>Gestionar Pedidos</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Filtros */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {['todos', 'pendiente', 'completado', 'cancelado'].map((f) => {
          const count = f === 'todos' 
            ? pedidos.length 
            : pedidos.filter(p => p.estado.toLowerCase() === f.toLowerCase()).length;

          return (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                filtro === f && styles.filterChipActive
              ]}
              onPress={() => setFiltro(f)}
            >
              <Text style={[
                styles.filterText,
                filtro === f && styles.filterTextActive
              ]}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de pedidos */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D4AF37" />
        }
      >
        {pedidosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No hay pedidos {filtro !== 'todos' ? filtro + 's' : ''}</Text>
          </View>
        ) : (
          pedidosFiltrados.map((pedido) => {
            const fecha = new Date(pedido.fecha_creacion);
            const fechaFormateada = fecha.toLocaleDateString('es-MX', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <TouchableOpacity
                key={pedido.id}
                style={styles.pedidoCard}
                onPress={() => verDetallePedido(pedido)}
              >
                {/* Header del pedido */}
                <View style={styles.pedidoHeader}>
                  <View>
                    <Text style={styles.numeroPedido}>{pedido.numero_pedido}</Text>
                    <Text style={styles.fechaPedido}>{fechaFormateada}</Text>
                  </View>
                  <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(pedido.estado) }]}>
                    <Text style={styles.estadoText}>
                      {getEstadoIcon(pedido.estado)} {pedido.estado}
                    </Text>
                  </View>
                </View>

                {/* Info del cliente */}
                <View style={styles.clienteInfo}>
                  <Text style={styles.clienteLabel}>Cliente:</Text>
                  <Text style={styles.clienteNombre}>{pedido.cliente_nombre || 'Sin nombre'}</Text>
                  {pedido.telefono && (
                    <Text style={styles.clienteContacto}>📱 {pedido.telefono}</Text>
                  )}
                  {pedido.email && (
                    <Text style={styles.clienteContacto}>✉️ {pedido.email}</Text>
                  )}
                </View>

                {/* Total */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalAmount}>${Number(pedido.total).toFixed(2)}</Text>
                </View>

                {/* Acciones */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => verDetallePedido(pedido)}
                  >
                    <Text style={styles.actionButtonText}>👁️ Ver Detalle</Text>
                  </TouchableOpacity>

                  {pedido.estado.toLowerCase() === 'pendiente' && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonSuccess]}
                        onPress={() => confirmarCambioEstado(pedido, 'completado')}
                      >
                        <Text style={styles.actionButtonText}>✅ Completar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonDanger]}
                        onPress={() => confirmarCambioEstado(pedido, 'cancelado')}
                      >
                        <Text style={styles.actionButtonText}>❌</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {pedido.estado.toLowerCase() === 'cancelado' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonWarning]}
                      onPress={() => confirmarCambioEstado(pedido, 'pendiente')}
                    >
                      <Text style={styles.actionButtonText}>↩️ Reactivar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#F5F5F5',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1C1C1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F5F5F5',
  },
  filtersContainer: {
    maxHeight: 60,
    backgroundColor: '#0A0A0A',
  },
  filtersContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1C1C1E',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  filterChipActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  filterText: {
    color: '#F5F5F5',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#0A0A0A',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  pedidoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  numeroPedido: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  fechaPedido: {
    fontSize: 12,
    color: '#8E8E93',
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  estadoText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  clienteInfo: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  clienteLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F5F5F5',
    marginBottom: 4,
  },
  clienteContacto: {
    fontSize: 13,
    color: '#C7C7CC',
    marginTop: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#2C2C2E',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonSuccess: {
    backgroundColor: '#34C759',
  },
  actionButtonDanger: {
    backgroundColor: '#FF3B30',
    flex: 0,
    minWidth: 50,
  },
  actionButtonWarning: {
    backgroundColor: '#FF9500',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});