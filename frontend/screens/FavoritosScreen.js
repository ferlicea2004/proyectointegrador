// screens/FavoritosScreen.js
// Pantalla de productos favoritos funcional

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useFavoritos } from '../contexts/FavoritosContext';
import { useTheme } from '../contexts/ThemeContext';
import productImages from '../assets/images/productimages';
import ChatbotButton from '../components/ChatbotButton';

export default function FavoritosScreen({ navigation }) {
  const { theme } = useTheme();
  const { favoritos, toggleFavorito } = useFavoritos();

  const handleQuitar = (producto) => {
    toggleFavorito(producto);
  };

  const styles = createStyles(theme);

  if (favoritos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>⭐ Mis Favoritos</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyTitle}>No tienes favoritos</Text>
          <Text style={styles.emptySubtitle}>
            Marca productos como favoritos para verlos aquí
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Tienda')}
          >
            <Text style={styles.shopButtonText}>Ir a la Tienda</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⭐ Mis Favoritos</Text>
        <Text style={styles.headerCount}>{String(favoritos.length)} productos</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.productsGrid}>
          {favoritos.map((producto) => {
            const precio = Number(producto.precio) || 0;

            return (
              <TouchableOpacity
                key={producto.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('DetalleProducto', { producto })}
              >
                <TouchableOpacity
                  style={styles.favButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleQuitar(producto);
                  }}
                >
                  <Text style={styles.favIcon}>❤️</Text>
                </TouchableOpacity>

                <View style={styles.productImageContainer}>
                  {producto?.imagen ? (
  productImages[producto.imagen] ? (
    <Image
      source={productImages[producto.imagen]}
      style={styles.productImage}
      resizeMode="contain"
    />
  ) : (
    <Image
      source={{ uri: `http://192.168.1.89:3000/uploads/productos/${producto.imagen}` }}
      style={styles.productImage}
      resizeMode="contain"
    />
  )
) : (
  <Text style={styles.productImagePlaceholder}>📦</Text>
)}
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {producto.nombre}
                  </Text>
                  <Text style={styles.productCategory}>{producto.categoria}</Text>
                  <Text style={styles.productPrice}>${precio.toFixed(2)}</Text>

                  {producto.stock === 0 ? (
                    <Text style={styles.outOfStock}>Agotado</Text>
                  ) : (
                    <Text style={styles.inStock}>Disponible</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  headerCount: {
    fontSize: 14,
    color: theme.textTertiary,
  },
  content: {
    flex: 1,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: theme.card,
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.border,
    position: 'relative',
  },
  favButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
  },
  favIcon: {
    fontSize: 20,
  },
  productImageContainer: {
    height: 120,
    backgroundColor: theme.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImagePlaceholder: {
    fontSize: 50,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 5,
    height: 40,
  },
  productCategory: {
    fontSize: 11,
    color: theme.textTertiary,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 8,
  },
  inStock: {
    fontSize: 11,
    color: theme.success,
  },
  outOfStock: {
    fontSize: 11,
    color: theme.error,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.textTertiary,
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    color: '#0A0A0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});