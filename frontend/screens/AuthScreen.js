// screens/AuthScreen.js
// Pantalla de registro/login

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
import Checkbox from 'expo-checkbox';

export default function AuthScreen({ navigation }) {
  const { theme } = useTheme();
  const { register } = useUser();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [comoNosConocio, setComoNosConocio] = useState('Instagram');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ← FUNCIÓN PARA VALIDAR EMAIL
  const validarEmail = (email) => {
    const emailLower = email.toLowerCase().trim();
    
    // Validar formato básico
    const formatoBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoBasico.test(emailLower)) {
      return { valido: false, mensaje: 'Formato de email inválido' };
    }

    // Detectar typos comunes
    const typosComunes = {
      'gmial': 'gmail',
      'gmai': 'gmail',
      'gnail': 'gmail',
      'gmil': 'gmail',
      'hotmial': 'hotmail',
      'hotmal': 'hotmail',
      'outlok': 'outlook',
      'outloo': 'outlook',
    };

    for (const [typo, correcto] of Object.entries(typosComunes)) {
      if (emailLower.includes(`@${typo}.`)) {
        return {
          valido: false,
          mensaje: `¿Quisiste decir @${correcto}?`,
          sugerencia: emailLower.replace(typo, correcto)
        };
      }
    }

    // Dominios válidos
    const dominiosValidos = [
      'gmail.com',
      'hotmail.com',
      'outlook.com',
      'yahoo.com',
      'icloud.com',
      'ucc.mx',
      'live.com',
      'msn.com',
      'protonmail.com',
      'mail.com',
    ];

    const dominio = emailLower.split('@')[1];
    
    // Verificar si es un dominio válido o un subdominio válido
    const esValido = dominiosValidos.some(d => 
      dominio === d || dominio.endsWith(`.${d}`)
    );

    if (!esValido) {
      return {
        valido: false,
        mensaje: `El dominio @${dominio} no es válido. Usa: gmail.com, hotmail.com, outlook.com, ucc.mx, etc.`
      };
    }

    // Verificar extensión del dominio
    if (!dominio.includes('.') || dominio.endsWith('.')) {
      return { valido: false, mensaje: 'Dominio incompleto (falta .com, .mx, etc.)' };
    }

    return { valido: true };
  };

  const handleRegistro = async () => {
    // Validar campos vacíos
    if (!nombre || !email || !telefono || !password) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar email mejorado
    const validacionEmail = validarEmail(email);
    if (!validacionEmail.valido) {
      if (validacionEmail.sugerencia) {
        Alert.alert(
          'Email incorrecto',
          validacionEmail.mensaje,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Usar sugerencia',
              onPress: () => setEmail(validacionEmail.sugerencia)
            }
          ]
        );
      } else {
        Alert.alert('Email inválido', validacionEmail.mensaje);
      }
      return;
    }

    // Validar teléfono (10 dígitos)
    const telefonoLimpio = telefono.replace(/\D/g, '');
    if (telefonoLimpio.length !== 10) {
      Alert.alert(
        'Teléfono inválido',
        'El número de teléfono debe tener exactamente 10 dígitos',
        [{ text: 'OK' }]
      );
      return;
    }

    // Validar contraseña
    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    // Validar términos
    if (!aceptaTerminos) {
      Alert.alert(
        'Términos y Condiciones',
        'Debes aceptar los términos y condiciones para continuar',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const response = await api.registrarCliente({
        nombre,
        email: email.toLowerCase().trim(),
        telefono: telefonoLimpio,
        password,
        como_nos_conocio: comoNosConocio,
      });

      if (response.success) {
        await register(response.data);
        
        Alert.alert('¡Registro exitoso!', 'Tu cuenta ha sido creada', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', response.error || 'No se pudo completar el registro');
      }
    } catch (error) {
      console.log('Error capturado:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
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
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>
            Regístrate para guardar tu información y ver tu historial de pedidos
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Juan Pérez"
              placeholderTextColor="#8E8E93"
              value={nombre}
              onChangeText={setNombre}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono * (10 dígitos)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 4611234567"
              placeholderTextColor="#8E8E93"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Mínimo 6 caracteres"
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
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar contraseña *</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingresa la contraseña nuevamente"
                placeholderTextColor="#8E8E93"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>¿Cómo nos conociste? *</Text>
            <View style={styles.pickerContainer}>
              {['Instagram', 'Anuncios', 'Expos', 'Recomendación'].map((opcion) => (
                <TouchableOpacity
                  key={opcion}
                  style={[
                    styles.pickerOption,
                    comoNosConocio === opcion && styles.pickerOptionSelected
                  ]}
                  onPress={() => setComoNosConocio(opcion)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    comoNosConocio === opcion && styles.pickerOptionTextSelected
                  ]}>
                    {opcion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Checkbox de términos */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={aceptaTerminos}
              onValueChange={setAceptaTerminos}
              color={aceptaTerminos ? theme.primary : theme.textTertiary}
              style={styles.checkbox}
            />
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxText}>
                Acepto los{' '}
                <Text 
                  style={styles.checkboxLink}
                  onPress={() => navigation.navigate('Terminos')}
                >
                  términos y condiciones
                </Text>
                {' '}y{' '}
                <Text 
                  style={styles.checkboxLink}
                  onPress={() => navigation.navigate('Privacidad')}
                >
                  política de privacidad
                </Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegistro}
          >
            <Text style={styles.registerButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  registerButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  registerButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: theme.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pickerOption: {
    backgroundColor: theme.backgroundTertiary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  pickerOptionSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  pickerOptionText: {
    color: theme.textTertiary,
    fontSize: 14,
    fontWeight: '600',
  },
  pickerOptionTextSelected: {
    color: '#0A0A0A',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 15,
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