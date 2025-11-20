// screens/LoginScreen.js
// Pantalla de login para admin

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validación básica
    if (!nombre || !password) {
      Alert.alert('Error', 'Por favor ingresa nombre y contraseña');
      return;
    }

    setLoading(true);

    try {
      const response = await api.login(nombre, password);

      if (response.success) {
        Alert.alert(
          'Bienvenido',
          `Hola ${response.data.nombre}!`,
          [
            {
              text: 'Continuar',
              onPress: () => navigation.replace('AdminPanel', { user: response.data }),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'Usuario no encontrado');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
            <Image 
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>KRAKEN STORE</Text>
            <Text style={styles.subtitle}>Panel Administrativo</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Israel, Fer, Belén o Sol"
              placeholderTextColor="#8E8E93"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#8E8E93"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </View>

        
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 15,
    },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 2,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    letterSpacing: 1,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#F5F5F5',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  button: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  hintContainer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  hintText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 3,
  },
});