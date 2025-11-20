// screens/SplashScreen.js
// Pantalla inicial con logo

import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Animación de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Navegar al login después de 2 segundos
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Image 
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>KRAKEN STORE</Text>
            <Text style={styles.subtitle}>Accesorios Premium</Text>
        </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 3,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#F5F5F5',
    letterSpacing: 1,
  },
});