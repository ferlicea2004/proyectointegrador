// screens/CheckoutScreen.js
// Pantalla para confirmar pedido y datos de cliente

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useCarrito } from '../contexts/CarritoContext';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import Checkbox from 'expo-checkbox';

export default function CheckoutScreen({ navigation }) {
  const { theme } = useTheme();
  const { carrito, calcularTotal, vaciarCarrito } = useCarrito();
  const [loading, setLoading] = useState(false);
  const { user, isGuest } = useUser();

  const [clienteInfo, setClienteInfo] = useState({
    nombre: '',
    email: '',
    telefono: '',
    notas: '',
  });
  const [aceptaGarantias, setAceptaGarantias] = useState(false);

  useEffect(() => {
    if (!isGuest && user) {
      setClienteInfo({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        notas: ''
      });
    }
  }, [user, isGuest]);

  const total = calcularTotal();

  const handleConfirmarPedido = async () => {
    console.log('🛒 Carrito completo:', JSON.stringify(carrito, null, 2));
  console.log('📦 Items mayoreo:', carrito.filter(item => item.tipo === 'mayoreo'));
  console.log('🏪 Items minoreo:', carrito.filter(item => !item.tipo || item.tipo === 'minoreo'));
  
    const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const tieneMayoreo = carrito.some(item => item.tipo === 'mayoreo');
    console.log('✅ Tiene mayoreo:', tieneMayoreo);
  console.log('📊 Total productos:', totalProductos);
    
    if (tieneMayoreo && totalProductos < 6) {
      Alert.alert(
        '📦 Pedido mínimo no alcanzado',
        `Para compras de mayoreo necesitas al menos 6 productos.\n\nActualmente tienes: ${totalProductos} producto${totalProductos !== 1 ? 's' : ''}.\n\nTe faltan: ${6 - totalProductos} más.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Seguir comprando', 
            onPress: () => navigation.navigate('Mayoreo')
          }
        ]
      );
      return;
    }

    if (!clienteInfo.nombre || !clienteInfo.telefono) {
      Alert.alert('Error', 'Por favor completa nombre y teléfono');
      return;
    }

    if (!aceptaGarantias) {
      Alert.alert(
        'Políticas de Garantía',
        'Debes aceptar las políticas de garantía para continuar con tu pedido',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);

    try {
      const pedidoData = {
        cliente_id: !isGuest && user ? user.id : null,
        tipo: tieneMayoreo ? 'mayoreo' : 'minoreo',
        total: total,
        via: 'app',
        productos: carrito.map(item => ({
          id: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        notas: clienteInfo.notas || null,
        cliente_info: {
          nombre: clienteInfo.nombre,
          email: clienteInfo.email || null,
          telefono: clienteInfo.telefono || null,
          como_nos_conocio: 'App Móvil',
        },
      };

      console.log('Enviando pedido:', pedidoData);

      const response = await api.createPedido(pedidoData);

      if (response.success) {
        vaciarCarrito();

        Alert.alert(
          '¡Pedido Confirmado! 🎉',
          `Tu pedido ${response.data.numero_pedido} ha sido creado exitosamente.\n\nTotal: $${total.toFixed(2)}\n\nNos pondremos en contacto contigo pronto.`,
          [
            {
              text: 'Ver mis pedidos',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs', params: { screen: 'Perfil' } }],
                });
              },
            },
            {
              text: 'Seguir comprando',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs', params: { screen: 'Tienda' } }],
                });
              },
            },
          ],
          { cancelable: false }
        );

      } else {
        Alert.alert('Error', response.error || 'No se pudo crear el pedido');
      }
    } catch (error) {
      console.error('Error al confirmar pedido:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar Pedido</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Contador de productos mayoreo */}
        {carrito.some(item => item.tipo === 'mayoreo') && (
          <View style={styles.mayoreoCounter}>
            <Text style={styles.mayoreoCounterIcon}>📦</Text>
            <View style={styles.mayoreoCounterText}>
              <Text style={styles.mayoreoCounterTitle}>
  Productos de mayoreo: {String(carrito.reduce((sum, item) => item.tipo === 'mayoreo' ? sum + item.cantidad : sum, 0))}
</Text>
<Text style={styles.mayoreoCounterSubtitle}>
  {carrito.reduce((sum, item) => item.tipo === 'mayoreo' ? sum + item.cantidad : sum, 0) >= 6 
    ? '✅ Pedido mínimo alcanzado' 
    : `⚠️ Faltan ${String(6 - carrito.reduce((sum, item) => item.tipo === 'mayoreo' ? sum + item.cantidad : sum, 0))} productos`}
</Text>
            </View>
          </View>
        )}

        {/* Resumen del pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Resumen del Pedido</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              {carrito.length} producto{carrito.length !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Datos del cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Tus Datos</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo *</Text>
            <TextInput
              style={[styles.input, !isGuest && styles.inputDisabled]}
              placeholder="Juan Pérez"
              placeholderTextColor="#8E8E93"
              value={clienteInfo.nombre}
              onChangeText={(text) => setClienteInfo({ ...clienteInfo, nombre: text })}
              editable={isGuest}
            />
            {!isGuest && (
              <Text style={styles.helpText}>✓ Datos de tu perfil</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={[styles.input, !isGuest && styles.inputDisabled]}
              placeholder="2291234567"
              placeholderTextColor="#8E8E93"
              value={clienteInfo.telefono}
              onChangeText={(text) => setClienteInfo({ ...clienteInfo, telefono: text })}
              keyboardType="phone-pad"
              editable={isGuest}
            />
            {!isGuest && (
              <Text style={styles.helpText}>✓ Datos de tu perfil</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email (opcional)</Text>
            <TextInput
              style={[styles.input, !isGuest && styles.inputDisabled]}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#8E8E93"
              value={clienteInfo.email}
              onChangeText={(text) => setClienteInfo({ ...clienteInfo, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={isGuest}
            />
            {!isGuest && (
              <Text style={styles.helpText}>✓ Datos de tu perfil</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notas adicionales (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ejemplo: Entrega a domicilio, color preferido, etc."
              placeholderTextColor="#8E8E93"
              value={clienteInfo.notas}
              onChangeText={(text) => setClienteInfo({ ...clienteInfo, notas: text })}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Checkbox de garantías */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={aceptaGarantias}
              onValueChange={setAceptaGarantias}
              color={aceptaGarantias ? theme.primary : theme.textTertiary}
              style={styles.checkbox}
            />
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxText}>
                Acepto las{' '}
                <Text 
                  style={styles.checkboxLink}
                  onPress={() => navigation.navigate('Terminos')}
                >
                  políticas de garantía y términos de venta
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            📞 Nos pondremos en contacto contigo para confirmar tu pedido y coordinar la entrega.
          </Text>
        </View>
      </ScrollView>

      {/* Footer con botón */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirmarPedido}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0A0A0A" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 16,
    color: theme.text,
  },
  summaryTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: theme.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.backgroundSecondary,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  infoCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: theme.backgroundTertiary,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  infoText: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  footer: {
    backgroundColor: theme.backgroundSecondary,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.primary,
  },
  confirmButton: {
    backgroundColor: theme.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#0A0A0A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mayoreoCounter: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    padding: 15,
    borderRadius: 12,
    margin: 20,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
  },
  mayoreoCounterIcon: {
    fontSize: 30,
    marginRight: 12,
  },
  mayoreoCounterText: {
    flex: 1,
  },
  mayoreoCounterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  mayoreoCounterSubtitle: {
    fontSize: 12,
    color: theme.textTertiary,
  },
  inputDisabled: {
    backgroundColor: theme.backgroundSecondary,
    opacity: 0.7,
  },
  helpText: {
    fontSize: 12,
    color: theme.primary,
    marginTop: 5,
    marginLeft: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  checkboxLink: {
    color: theme.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});