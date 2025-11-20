// screens/AgregarProductoScreen.js
// Pantalla para agregar nuevos productos (solo CEO)

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
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import api from '../services/api';

export default function AgregarProductoScreen({ navigation }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [imagen, setImagen] = useState(null);

  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria: 'Fundas',
    destacado: false,
  });

  const categorias = [
    'Audio',
    'Relojes',
    'Cargadores',
    'Baterías',
    'Proyectores',
    'Accesorios',
  ];

  

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagen(result.assets[0]);
    }
  };

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImagen(result.assets[0]);
    }
  };

  const handleSeleccionImagen = () => {
    Alert.alert(
      'Seleccionar imagen',
      '¿De dónde quieres obtener la imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: '📷 Tomar foto', onPress: tomarFoto },
        { text: '🖼️ Galería', onPress: seleccionarImagen },
      ]
    );
  };

  const validarCampos = () => {
    if (!producto.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }

    if (!producto.precio || Number(producto.precio) <= 0) {
      Alert.alert('Error', 'El precio debe ser mayor a 0');
      return false;
    }

    if (!producto.stock || Number(producto.stock) < 0) {
      Alert.alert('Error', 'El stock debe ser mayor o igual a 0');
      return false;
    }

    if (producto.precio_mayoreo && Number(producto.precio_mayoreo) >= Number(producto.precio)) {
      Alert.alert('Error', 'El precio de mayoreo debe ser menor al precio normal');
      return false;
    }

    return true;
  };

  const handleAgregarProducto = async () => {
    if (!validarCampos()) return;

    setLoading(true);

    try {
      // Crear FormData para enviar imagen
      const formData = new FormData();
      
      // Agregar imagen si existe
      if (imagen) {
        const filename = imagen.uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('imagen', {
          uri: Platform.OS === 'ios' ? imagen.uri.replace('file://', '') : imagen.uri,
          name: filename,
          type,
        });
      }

      // Agregar datos del producto
      formData.append('nombre', producto.nombre.trim());
      formData.append('descripcion', producto.descripcion.trim() || '');
      formData.append('precio', Number(producto.precio));
      formData.append('stock', Number(producto.stock));
      formData.append('categoria', producto.categoria);
      formData.append('destacado', producto.destacado ? 1 : 0);

      const response = await api.crearProducto(formData);

      if (response.success) {
        Alert.alert(
          '✅ Producto creado',
          `${producto.nombre} ha sido agregado exitosamente`,
          [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]
        );
      } else {
        Alert.alert('Error', response.error || 'No se pudo crear el producto');
      }
    } catch (error) {
      console.error('Error creando producto:', error);
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Producto</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Imagen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Imagen del Producto</Text>
          
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handleSeleccionImagen}
          >
            {imagen ? (
              <Image source={{ uri: imagen.uri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderIcon}>📷</Text>
                <Text style={styles.imagePlaceholderText}>Toca para agregar foto</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {imagen && (
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImagen(null)}
            >
              <Text style={styles.removeImageText}>✕ Quitar imagen</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Información Básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Información Básica</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nombre del producto *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Funda iPhone 15 Pro"
              placeholderTextColor={theme.textTertiary}
              value={producto.nombre}
              onChangeText={(text) => setProducto({ ...producto, nombre: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción del producto..."
              placeholderTextColor={theme.textTertiary}
              value={producto.descripcion}
              onChangeText={(text) => setProducto({ ...producto, descripcion: text })}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Categoría *</Text>
            <View style={styles.categoriaContainer}>
              {categorias.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoriaChip,
                    producto.categoria === cat && styles.categoriaChipSelected,
                  ]}
                  onPress={() => setProducto({ ...producto, categoria: cat })}
                >
                  <Text
                    style={[
                      styles.categoriaChipText,
                      producto.categoria === cat && styles.categoriaChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Precios y Stock */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Precios y Stock</Text>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Precio Minoreo *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={theme.textTertiary}
                value={producto.precio}
                onChangeText={(text) => setProducto({ ...producto, precio: text })}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.label}>Stock *</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={theme.textTertiary}
                value={producto.stock}
                onChangeText={(text) => setProducto({ ...producto, stock: text })}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        

        {/* Destacado */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.destacadoContainer}
            onPress={() => setProducto({ ...producto, destacado: !producto.destacado })}
          >
            <Checkbox
              value={producto.destacado}
              onValueChange={(value) => setProducto({ ...producto, destacado: value })}
              color={producto.destacado ? theme.primary : theme.textTertiary}
            />
            <View style={styles.destacadoText}>
              <Text style={styles.destacadoLabel}>⭐ Marcar como destacado</Text>
              <Text style={styles.destacadoSubtitle}>
                Aparecerá en la sección de productos destacados
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Botón Guardar */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleAgregarProducto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0A0A0A" />
            ) : (
              <Text style={styles.saveButtonText}>✓ Agregar Producto</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
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
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 15,
    },
    imagePicker: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 2,
      borderColor: theme.border,
      borderStyle: 'dashed',
    },
    imagePreview: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imagePlaceholderIcon: {
      fontSize: 50,
      marginBottom: 10,
    },
    imagePlaceholderText: {
      fontSize: 14,
      color: theme.textTertiary,
    },
    removeImageButton: {
      marginTop: 10,
      alignItems: 'center',
      padding: 10,
    },
    removeImageText: {
      fontSize: 14,
      color: theme.error,
      fontWeight: '600',
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
    helpText: {
      fontSize: 12,
      color: theme.textTertiary,
      marginTop: 5,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    categoriaContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    categoriaChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoriaChipSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoriaChipText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: '600',
    },
    categoriaChipTextSelected: {
      color: '#0A0A0A',
    },
    garantiaContainer: {
      gap: 12,
    },
    garantiaOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderRadius: 12,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.border,
    },
    garantiaOptionSelected: {
      backgroundColor: theme.card,
      borderColor: theme.primary,
      borderWidth: 2,
    },
    radioOuter: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.primary,
    },
    garantiaText: {
      fontSize: 15,
      color: theme.text,
      fontWeight: '500',
    },
    garantiaTextSelected: {
      fontWeight: '700',
    },
    destacadoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: theme.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    destacadoText: {
      marginLeft: 12,
      flex: 1,
    },
    destacadoLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 3,
    },
    destacadoSubtitle: {
      fontSize: 12,
      color: theme.textTertiary,
    },
    saveButton: {
      backgroundColor: theme.primary,
      padding: 18,
      borderRadius: 12,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#0A0A0A',
    },
  });