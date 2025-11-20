// screens/MisDatosScreen.js
// Pantalla para editar datos del usuario

import React, { useState } from 'react';
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
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function MisDatosScreen({ navigation }) {
  const { theme } = useTheme();
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);

  const [datos, setDatos] = useState({
    nombre: user?.nombre || '',
    telefono: user?.telefono || '',
  });

  const handleGuardar = async () => {
    if (!datos.nombre || !datos.telefono) {
      Alert.alert('Error', 'Nombre y teléfono son obligatorios');
      return;
    }

    setLoading(true);

    try {
      const response = await api.actualizarPerfilCliente(user.id, datos);

      if (response.success) {
        await updateUser(response.data);
        
        setEditando(false);
        Alert.alert('✅ Guardado', 'Tus datos han sido actualizados');
      } else {
        Alert.alert('Error', response.error || 'No se pudieron actualizar los datos');
      }
    } catch (error) {
      console.error('Error actualizando datos:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setDatos({
      nombre: user?.nombre || '',
      telefono: user?.telefono || '',
    });
    setEditando(false);
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Datos</Text>
        {!editando ? (
          <TouchableOpacity onPress={() => setEditando(true)}>
            <Text style={styles.editButton}>Editar</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nombre?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={[styles.input, !editando && styles.inputDisabled]}
              placeholder="Tu nombre"
              placeholderTextColor="#8E8E93"
              value={datos.nombre}
              onChangeText={(text) => setDatos({ ...datos, nombre: text })}
              editable={editando}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.input, styles.inputDisabled]}>
              <Text style={styles.inputText}>{user?.email}</Text>
            </View>
            <Text style={styles.helpText}>
              ℹ️ El email no se puede cambiar
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={[styles.input, !editando && styles.inputDisabled]}
              placeholder="2291234567"
              placeholderTextColor="#8E8E93"
              value={datos.telefono}
              onChangeText={(text) => setDatos({ ...datos, telefono: text })}
              keyboardType="phone-pad"
              editable={editando}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>¿Cómo nos conociste?</Text>
            <View style={[styles.input, styles.inputDisabled]}>
              <Text style={styles.inputText}>
                {user?.como_nos_conocio || 'App móvil'}
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha de registro</Text>
            <View style={[styles.input, styles.inputDisabled]}>
              <Text style={styles.inputText}>
                {user?.fecha_registro 
                  ? new Date(user.fecha_registro).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        {editando && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelar}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleGuardar}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0A0A0A" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  editButton: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  form: {
    padding: 20,
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
  inputDisabled: {
    opacity: 0.6,
  },
  inputText: {
    fontSize: 16,
    color: theme.text,
  },
  helpText: {
    fontSize: 12,
    color: theme.textTertiary,
    marginTop: 5,
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.backgroundTertiary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});