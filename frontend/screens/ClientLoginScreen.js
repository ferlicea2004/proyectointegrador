// screens/ClientLoginScreen.js
// Pantalla de login para clientes

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function ClientLoginScreen({ navigation }) {
  const { theme } = useTheme();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor ingresa email y contraseña');
      return;
    }

    setLoading(true);

    try {
      console.log('Intentando login:', email);
      
      const response = await api.loginCliente(email, password);
      
      console.log('Respuesta login:', response);

      if (response.success) {
        await login(response.data);
        
        Alert.alert('¡Bienvenido!', `Hola ${response.data.nombre}`, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.error || 'Email o contraseña incorrectos');
      }
    } catch (error) {
      console.log('Error capturado:', error);
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
        </View>

        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>
            Ingresa con tu cuenta para continuar
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Tu contraseña"
              placeholderTextColor="#8E8E93"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>{showPassword ? '👁️':'👁️‍🗨️'}</Text>
            </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>

          {/* Link a registro */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={styles.registerLink}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
          {/* Link a login admin */}
<View style={styles.adminLinkContainer}>
  <TouchableOpacity 
    style={styles.adminLinkButton}
    onPress={() => navigation.navigate('Login')}
  >
    <Text style={styles.adminLinkIcon}>⚙️</Text>
    <Text style={styles.adminLinkText}>¿Eres administrador? Inicia sesión aquí</Text>
  </TouchableOpacity>
</View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textTertiary,
    lineHeight: 22,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
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
  loginButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  registerLink: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '600',
  },
  adminLinkContainer: {
  marginTop: 30,
  paddingTop: 20,
  borderTopWidth: 1,
  borderTopColor: theme.border,
},
adminLinkButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.backgroundTertiary,
  padding: 14,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: theme.border,
},
adminLinkIcon: {
  fontSize: 18,
  marginRight: 8,
},
adminLinkText: {
  color: theme.primary,
  fontSize: 14,
  fontWeight: '600',
},
hintText: {
  fontSize: 12,
  color: '#8E8E93',
  marginBottom: 3,
},
passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: theme.backgroundSecondary,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: theme.border,
},
passwordInput: {
  flex: 1,
  padding: 15,
  fontSize: 16,
  color: theme.text,
},
eyeButton: {
  padding: 15,
},
eyeIcon: {
  fontSize: 20,
},
});