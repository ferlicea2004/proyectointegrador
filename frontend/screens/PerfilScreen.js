// screens/PerfilScreen.js
// Pantalla de perfil con acceso admin oculto

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import ChatbotButton from '../components/ChatbotButton';

export default function PerfilScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { user, isGuest, logout } = useUser();


  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const opciones = [
    { 
      icon: '👤', 
      title: 'Mis Datos', 
      subtitle: 'Información personal',
      screen: 'MisDatos',
      requiresAuth: true,
    },
    { 
      icon: '📦', 
      title: 'Mis Pedidos', 
      subtitle: 'Historial de compras',
      screen: 'MisPedidos',
      requiresAuth: true,
    },
    { 
      icon: '⚙️', 
      title: 'Configuración', 
      subtitle: 'Preferencias de la app',
      screen: 'Configuracion',
      requiresAuth: false,
    },
    { 
      icon: '❓', 
      title: 'Ayuda', 
      subtitle: 'Preguntas frecuentes',
      screen: 'Ayuda',
      requiresAuth: false,
    },
    { 
      icon: 'ℹ️', 
      title: 'Acerca de', 
      subtitle: 'Información de la app',
      screen: 'AcercaDe',
      requiresAuth: false,
    },
  ];

  const handleOptionPress = (opcion) => {
  if (opcion.requiresAuth && isGuest) {
    Alert.alert(
      'Inicia sesión',
      'Necesitas crear una cuenta para acceder a esta función',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Registrarme', onPress: () => navigation.navigate('Auth') },
      ]
    );
    return;
  }

  if (opcion.screen) {
    // Navegar a la pantalla correspondiente
    if (opcion.screen === 'MisPedidos') {
      navigation.navigate('MisPedidos');
    } else if (opcion.screen === 'MisDatos') {
      navigation.navigate('MisDatos');
    } else if (opcion.screen === 'Configuracion') {
      navigation.navigate('Configuracion');
    } else if (opcion.screen === 'Ayuda') {
      navigation.navigate('Ayuda');  // ← AGREGAR ESTO
    } else if (opcion.screen === 'AcercaDe') {
      Alert.alert(
        '📱 Kraken Store',
        'Versión 1.0.0\n\nAccesorios premium para iPhone\n\n© 2025 Kraken Store\nVeracruz, México',
        [{ text: 'OK' }]
      );
    } else {
      // Otras pantallas próximamente
      Alert.alert('Próximamente', opcion.title);
    }
  }
};

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/logo.png')}
          style={styles.avatar}
          resizeMode="contain"
        />

        {isGuest ? (
          <>
            <Text style={styles.userName}>Invitado</Text>
            <Text style={styles.userEmail}>Inicia sesión o regístrate</Text>
            
            <View style={styles.authButtons}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('ClientLogin')}
              >
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate('Auth')}
              >
                <Text style={styles.registerButtonText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.welcomeText}>Bienvenido</Text>
            <Text style={styles.userName}>{user?.nombre}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </>
        )}
      </View>

      {/* Opciones */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {opciones.map((opcion, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                index === opciones.length - 1 && styles.optionItemLast
              ]}
              onPress={() => handleOptionPress(opcion)}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>{opcion.icon}</Text>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{opcion.title}</Text>
                  <Text style={styles.optionSubtitle}>{opcion.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón cerrar sesión */}
        {!isGuest && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>KRAKEN STORE</Text>
          <Text style={styles.footerVersion}>Versión 1.0.0</Text>
          <Text style={styles.footerSubtext}>Hecho con amor en México 🇲🇽</Text>
        </View>
      </ScrollView>
      <ChatbotButton />
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: theme.backgroundSecondary,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.textTertiary,
    marginBottom: 5,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  authButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  loginButton: {
    flex: 1,
    backgroundColor: theme.backgroundTertiary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  loginButtonText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    flex: 1,
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  registerButtonText: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    backgroundColor: theme.card,
    marginHorizontal: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: theme.textTertiary,
  },
  optionArrow: {
    fontSize: 24,
    color: theme.textTertiary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundTertiary,
    marginHorizontal: 15,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 14,
    color: theme.error,
    fontWeight: '600',
  },
  adminSection: {
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundTertiary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  adminIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  adminText: {
    fontSize: 14,
    color: theme.textTertiary,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.primary,
    letterSpacing: 2,
    marginBottom: 5,
  },
  footerVersion: {
    fontSize: 12,
    color: theme.textTertiary,
    marginBottom: 3,
  },
  footerSubtext: {
    fontSize: 12,
    color: theme.textTertiary,
  },
});