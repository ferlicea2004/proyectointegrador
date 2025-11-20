// screens/AdminPanelScreen.js
// Panel de administración con control de roles

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function AdminPanelScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { user } = route.params;
  const esCEO = user.rol === 'CEO';
  const [pedidosPendientes, setPedidosPendientes] = useState(0);
  
  const [stats, setStats] = useState({
    productos: '...',
    pedidos: '...',
    ventas: '...',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  // Recargar estadísticas al volver a esta pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarEstadisticas();
    });
    return unsubscribe;
  }, [navigation]);

  const cargarEstadisticas = async () => {
    try {
      const productosResponse = await api.getProductos();
      const totalProductos = productosResponse.success ? productosResponse.data.length : 0;
      const pedidosResponse = await api.getPedidos();
      const pedidos = pedidosResponse.success ? pedidosResponse.data : [];
      const totalPedidos = pedidos.length;
      // ← CONTAR PEDIDOS PENDIENTES
      const pendientes = pedidos.filter(p => {
        const estado = (p.estado || '').toString().trim().toLowerCase();
        return estado === 'pendiente';
      });
      setPedidosPendientes(pendientes.length);
      const pedidosCompletados = pedidos.filter(p => p.estado.toLowerCase() === 'completado');
      const totalVentas = pedidosCompletados.reduce((sum, p) => sum + Number(p.total), 0);
      setStats({
        productos: totalProductos.toString(),
        pedidos: totalPedidos.toString(),
        ventas: totalVentas >= 1000 
          ? `$${(totalVentas / 1000).toFixed(1)}K` 
          : `$${totalVentas.toFixed(0)}`,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Opciones de menú según rol
  const menuOptions = [
  // Solo CEO ve Gestionar Productos
  esCEO && { 
    icon: '📦', 
    title: 'Gestionar Productos', 
    subtitle: 'Ver, editar stock y precios', 
    color: '#FF6B6B', 
    screen: 'GestionProductos' 
  },
  // TODOS ven Ver Pedidos
  { 
    icon: '🛒', 
    title: 'Ver Pedidos', 
    subtitle: 'Gestionar pedidos de clientes', 
    color: '#4ECDC4', 
    screen: 'GestionPedidos',
    badge: pedidosPendientes  
  },
  // TODOS ven Clientes
  { 
    icon: '👥', 
    title: 'Clientes', 
    subtitle: 'Lista de clientes registrados', 
    color: '#95E1D3',
    screen: 'ClientesAdmin'
  },
  // Solo CEO ve Estadísticas
  esCEO && { 
    icon: '📊', 
    title: 'Estadísticas', 
    subtitle: 'Ventas y métricas', 
    color: '#F38181',
    screen: 'EstadisticasAdmin'
  },
  ].filter(Boolean);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas salir del panel de administración?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => navigation.navigate('MainTabs'),
        },
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Panel Admin {esCEO ? '👑' : '💼'}
          </Text>
          <Text style={styles.userName}>
            {user.nombre} • {esCEO ? 'CEO' : 'Empleado'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={cargarEstadisticas}
          >
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Stats - TODOS pueden ver */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            {loading ? (
              <ActivityIndicator color={theme.primary} />
            ) : (
              <>
                <Text style={styles.statNumber}>{String(stats.productos)}</Text>
                <Text style={styles.statLabel}>Productos</Text>
              </>
            )}
          </View>
          <View style={styles.statCard}>
            {loading ? (
              <ActivityIndicator color={theme.primary} />
            ) : (
              <>
                <Text style={styles.statNumber}>{String(stats.pedidos)}</Text>
                <Text style={styles.statLabel}>Pedidos</Text>
              </>
            )}
          </View>
          <View style={styles.statCard}>
            {loading ? (
              <ActivityIndicator color={theme.primary} />
            ) : (
              <>
                <Text style={styles.statNumber}>{String(stats.ventas)}</Text>
                <Text style={styles.statLabel}>Ventas</Text>
              </>
            )}
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          {menuOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuCard, { borderLeftColor: option.color, borderLeftWidth: 4 }]}
              onPress={() => {
                if (option.screen) {
                  navigation.navigate(option.screen, { user });
                } else {
                  Alert.alert('Próximamente', option.title);
                }
              }}
            >
              <View style={styles.menuCardContent}>
                <Text style={styles.menuIcon}>{option.icon}</Text>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{option.title}</Text>
                  <Text style={styles.menuSubtitle}>{option.subtitle}</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
                
                {/* ← BADGE DE NOTIFICACIÓN */}
                {option.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{String(option.badge)}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  userName: {
    fontSize: 14,
    color: theme.primary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  refreshButton: {
    padding: 8,
  },
  refreshIcon: {
    fontSize: 20,
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: theme.backgroundTertiary,
    borderRadius: 8,
  },
  logoutText: {
    color: theme.error,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    minHeight: 80,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textTertiary,
    marginTop: 5,
  },
  menuContainer: {
    padding: 15,
  },
  menuCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  menuIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 3,
  },
  menuSubtitle: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  menuArrow: {
    fontSize: 24,
    color: theme.textTertiary,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: theme.card,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});