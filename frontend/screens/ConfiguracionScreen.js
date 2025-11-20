// screens/ConfiguracionScreen.js
// Pantalla de configuración y preferencias

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Vibration
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../contexts/ThemeContext'; 

export default function ConfiguracionScreen({ navigation }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [vibracion, setVibracion] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPreferencias();
  }, []);

  const cargarPreferencias = async () => {
    try {
      const prefs = await AsyncStorage.getItem('preferencias');
      if (prefs) {
        const { vibracion: vibra } = JSON.parse(prefs);
        setVibracion(vibra ?? true);
      }
    } catch (error) {
      console.error('Error cargando preferencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const guardarPreferencia = async (key, value) => {
    try {
      const prefsActuales = await AsyncStorage.getItem('preferencias');
      const prefs = prefsActuales ? JSON.parse(prefsActuales) : {};
      prefs[key] = value;
      await AsyncStorage.setItem('preferencias', JSON.stringify(prefs));
    } catch (error) {
      console.error('Error guardando preferencia:', error);
    }
  };

  const handleVibracionToggle = (value) => {
    setVibracion(value);
    guardarPreferencia('vibracion', value);
    
    if (value) {
      Vibration.vibrate(100);
      Alert.alert('✅ Activado', 'Sentirás vibración en tus acciones');
    } else {
      Alert.alert('📳 Desactivado', 'No habrá vibración');
    }
  };

  const handleModoOscuroToggle = async () => {
    await toggleTheme();
    Alert.alert(
      isDarkMode ? '☀️ Tema Claro' : '🌙 Tema Oscuro',
      `Cambiaste a modo ${isDarkMode ? 'claro' : 'oscuro'}`
    );
  };

  const handleContacto = () => {
    Alert.alert(
      '💬 Contáctanos',
      'Elige cómo quieres comunicarte con nosotros:',
      [
        {
          text: '📸 Instagram',
          onPress: async () => {
            const instagramUrl = 'https://www.instagram.com/kraken.storemx/';
            
            try {
              await Linking.openURL(instagramUrl);
            } catch (error) {
              Alert.alert(
                'Instagram',
                '@kraken.storemx\n\nBúscanos en Instagram como @kraken.storemx',
                [{ text: 'OK' }]
              );
            }
          },
        },
        {
          text: '📧 Email',
          onPress: async () => {
            const email = 'krakenshopelectronicos@gmail.com';
            await Clipboard.setStringAsync(email);
            
            Alert.alert(
              '✅ Email copiado',
              `${email}\n\nEl correo ha sido copiado al portapapeles. Puedes pegarlo en tu app de email.`,
              [{ text: 'OK' }]
            );
          },
        },
        { text: 'Cerrar', style: 'cancel' },
      ]
    );
  };

  const handleGuiaUso = () => {
    Alert.alert(
      '🎓 Guía de Uso - Kraken Store',
      
      '🛍️ COMPRAR:\n' +
      '• Explora productos en "Tienda" y "Mayoreo"\n' +
      '• Toca un producto para ver detalles\n' +
      '• Agrega al carrito y confirma tu pedido\n\n' +
      
      '❤️ FAVORITOS:\n' +
      '• Toca el corazón en cualquier producto\n' +
      '• Accede rápido desde el tab "Favoritos"\n\n' +
      
      '📦 MAYOREO:\n' +
      '• Precios especiales por volumen\n' +
      '• Pedido mínimo: 6 productos\n' +
      '• Mezcla diferentes artículos\n\n' +
      
      '👤 PERFIL:\n' +
      '• Crea cuenta para autocompletar datos\n' +
      '• Ve historial de pedidos\n' +
      '• Edita tu información\n\n' +
      
      '💡 TIP: Regístrate para una experiencia más rápida',
      
      [{ text: 'Entendido' }]
    );
  };
  
  const handleAcercaDeLaApp = () => {
    Alert.alert(
      '📱 Kraken Store',
      'Versión 1.0.0\n\nDesarrollado con amor en México\n\nAccessorios premium para tu iPhone\n\n© 2025 Kraken Store',
      [{ text: 'OK' }]
    );
  };

  const styles = createStyles(theme);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
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
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Sección: Preferencias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCIAS</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>📳</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Vibración</Text>
                <Text style={styles.settingSubtitle}>
                  Feedback táctil al interactuar
                </Text>
              </View>
            </View>
            <Switch
              value={vibracion}
              onValueChange={handleVibracionToggle}
              trackColor={{ false: theme.borderLight, true: theme.primary }}
              thumbColor={vibracion ? '#F5F5F5' : theme.textTertiary}
              ios_backgroundColor={theme.borderLight}
            />
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingIcon}>🌙</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Modo oscuro</Text>
                <Text style={styles.settingSubtitle}>
                  {isDarkMode ? 'Activado' : 'Desactivado'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleModoOscuroToggle}
              trackColor={{ false: theme.borderLight, true: theme.primary }}
              thumbColor={isDarkMode ? '#F5F5F5' : theme.textTertiary}
              ios_backgroundColor={theme.borderLight}
            />
          </View>
        </View>

        {/* Sección: Soporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOPORTE</Text>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleContacto}
          >
            <Text style={styles.optionIcon}>💬</Text>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Contáctanos</Text>
              <Text style={styles.optionSubtitle}>
                Instagram y correo electrónico
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleGuiaUso}
          >
            <Text style={styles.optionIcon}>🎓</Text>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Guía de uso</Text>
              <Text style={styles.optionSubtitle}>
                Tips y funciones destacadas
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sección: Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN</Text>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleAcercaDeLaApp}
          >
            <Text style={styles.optionIcon}>ℹ️</Text>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Acerca de la app</Text>
              <Text style={styles.optionSubtitle}>
                Versión 1.0.0
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('Terminos')}
          >
            <Text style={styles.optionIcon}>📄</Text>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Términos y condiciones</Text>
              <Text style={styles.optionSubtitle}>
                Lee nuestros términos de uso
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('Privacidad')}
          >
            <Text style={styles.optionIcon}>🔒</Text>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Política de privacidad</Text>
              <Text style={styles.optionSubtitle}>
                Cómo protegemos tus datos
              </Text>
            </View>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>KRAKEN STORE</Text>
          <Text style={styles.footerSubtext}>
            Hecho con ❤️ en Veracruz, México
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  loadingText: {
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
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.textTertiary,
    marginBottom: 12,
    letterSpacing: 1,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 3,
  },
  settingSubtitle: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  optionIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 3,
  },
  optionSubtitle: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  optionArrow: {
    fontSize: 24,
    color: theme.textTertiary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
    letterSpacing: 2,
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: theme.textTertiary,
  },
});