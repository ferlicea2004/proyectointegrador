// screens/admin/ClientesAdminScreen.js
// Panel de administración de clientes

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
  TextInput,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function ClientesAdminScreen({ navigation }) {
  const { theme } = useTheme();
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    nuevosEsteMes: 0,
    conPedidos: 0,
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    filtrarClientes();
  }, [busqueda, clientes]);

  const cargarClientes = async () => {
    try {
      const response = await api.obtenerClientes();
      
      if (response.success) {
        setClientes(response.data);
        calcularEstadisticas(response.data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los clientes');
      }
    } catch (error) {
      console.error('Error cargando clientes:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calcularEstadisticas = (data) => {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    const nuevosEsteMes = data.filter(cliente => {
      const fecha = new Date(cliente.fecha_registro);
      return fecha >= inicioMes;
    }).length;

    const conPedidos = data.filter(cliente => 
      cliente.total_pedidos && cliente.total_pedidos > 0
    ).length;

    setEstadisticas({
      total: data.length,
      nuevosEsteMes,
      conPedidos,
    });
  };

  const filtrarClientes = () => {
    if (!busqueda.trim()) {
      setClientesFiltrados(clientes);
      return;
    }

    const query = busqueda.toLowerCase();
    const filtrados = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(query) ||
      cliente.email.toLowerCase().includes(query) ||
      (cliente.telefono && cliente.telefono.includes(query))
    );

    setClientesFiltrados(filtrados);
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarClientes();
  };

  const verDetalleCliente = (cliente) => {
  Alert.alert(
    `👤 ${cliente.nombre}`,
    `📧 Email: ${cliente.email}\n` +
    `📱 Teléfono: ${cliente.telefono || 'No proporcionado'}\n` +
    `📦 Pedidos realizados: ${cliente.total_pedidos || 0}\n` +
    `💰 Total gastado: $${Number(cliente.total_gastado || 0).toFixed(2)}\n` +
    `📅 Registro: ${new Date(cliente.fecha_registro).toLocaleDateString('es-MX')}\n` +
    `📍 Cómo nos conoció: ${cliente.como_nos_conocio || 'N/A'}`,
    [
      { text: 'Cerrar', style: 'cancel' },
      {
        text: 'Ver pedidos',
        onPress: () => navigation.navigate('HistorialCliente', { cliente })
      }
    ]
  );
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
        <Text style={styles.loadingText}>Cargando clientes...</Text>
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
        <Text style={styles.headerTitle}>Clientes</Text>
        <View style={{ width: 60 }} />
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
        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{String(estadisticas.total)}</Text>
            <Text style={styles.statLabel}>Total Clientes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{String(estadisticas.nuevosEsteMes)}</Text>
            <Text style={styles.statLabel}>Nuevos este mes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{String(estadisticas.conPedidos)}</Text>
            <Text style={styles.statLabel}>Con pedidos</Text>
          </View>
        </View>

        {/* Buscador */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, email o teléfono"
            placeholderTextColor={theme.textTertiary}
            value={busqueda}
            onChangeText={setBusqueda}
          />
          {busqueda !== '' && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Lista de clientes */}
        {clientesFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyText}>
              {busqueda ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </Text>
          </View>
        ) : (
          <View style={styles.clientesContainer}>
            <Text style={styles.resultadosText}>
              {String(clientesFiltrados.length)} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
              {busqueda && ' encontrado' + (clientesFiltrados.length !== 1 ? 's' : '')}
            </Text>

            {clientesFiltrados.map((cliente) => (
              <TouchableOpacity
                key={cliente.id}
                style={styles.clienteCard}
                onPress={() => verDetalleCliente(cliente)}
              >
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {cliente.nombre.charAt(0).toUpperCase()}
                  </Text>
                </View>

                {/* Info */}
                <View style={styles.clienteInfo}>
                  <Text style={styles.clienteNombre}>{cliente.nombre}</Text>
                  <Text style={styles.clienteEmail}>{cliente.email}</Text>
                  
                  <View style={styles.clienteStats}>
                    <Text style={styles.clienteStat}>
                      📦 {cliente.total_pedidos || 0} pedidos
                    </Text>
                    <Text style={styles.clienteStat}>
                      💰 ${Number(cliente.total_gastado || 0).toFixed(2)}
                    </Text>
                  </View>

                  <Text style={styles.clienteFecha}>
                    Registrado: {formatearFecha(cliente.fecha_registro)}
                  </Text>
                </View>

                {/* Flecha */}
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textTertiary,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.text,
  },
  clearButton: {
    fontSize: 20,
    color: theme.textTertiary,
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: theme.textTertiary,
    textAlign: 'center',
  },
  clientesContainer: {
    paddingHorizontal: 15,
  },
  resultadosText: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 15,
    fontWeight: '600',
  },
  clienteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  clienteEmail: {
    fontSize: 13,
    color: theme.textSecondary,
    marginBottom: 8,
  },
  clienteStats: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 6,
  },
  clienteStat: {
    fontSize: 12,
    color: theme.textTertiary,
  },
  clienteFecha: {
    fontSize: 11,
    color: theme.textTertiary,
  },
  arrow: {
    fontSize: 24,
    color: theme.textTertiary,
    marginLeft: 10,
  },
});