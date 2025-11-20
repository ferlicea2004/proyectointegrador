import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, Text, View } from 'react-native';

// Importar Contextos
import { CarritoProvider } from './contexts/CarritoContext';
import { FavoritosProvider } from './contexts/FavoritosContext';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Importar pantallas
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import TiendaScreen from './screens/TiendaScreen';
import CarritoScreen from './screens/CarritoScreen';
import FavoritosScreen from './screens/FavoritosScreen';
import PerfilScreen from './screens/PerfilScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import DetalleProductoScreen from './screens/DetalleProductoScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import GestionProductosScreen from './screens/GestionProductosScreen';
import GestionPedidosScreen from './screens/GestionPedidosScreen';
import MayoreoScreen from './screens/MayoreoScreen';
import AuthScreen from './screens/AuthScreen';
import ClientLoginScreen from './screens/ClientLoginScreen';
import MisPedidosScreen from './screens/MisPedidosScreen'; 
import MisDatosScreen from './screens/MisDatosScreen';  
import ConfiguracionScreen from './screens/ConfiguracionScreen';
import TerminosScreen from './screens/TerminosScreen';  
import PrivacidadScreen from './screens/PrivacidadScreen';  
import AyudaScreen from './screens/AyudaScreen';
import ClientesAdminScreen from './screens/ClientesAdminScreen';
import HistorialClienteScreen from './screens/HistorialClienteScreen';
import EstadisticasAdminScreen from './screens/EstadisticasAdminScreen';
import AgregarProductoScreen from './screens/AgregarProductoScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegación de Tabs
function MainTabs() {
  const { theme, isDarkMode } = useTheme();  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.backgroundSecondary,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarActiveTintColor: theme.primary,  
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 5,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Tienda" 
        component={TiendaScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 28 }}>🛍️</Text>
          ),
          tabBarLabel: 'Tienda',
        }}
      />
      <Tab.Screen 
        name="Mayoreo" 
        component={MayoreoScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>📦</Text>
          ),
          tabBarLabel: 'Mayoreo',
        }}
      />
      <Tab.Screen 
        name="Carrito" 
        component={CarritoScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 28 }}>🛒</Text>
          ),
          tabBarLabel: 'Carrito',
        }}
      />
      <Tab.Screen 
        name="Favoritos" 
        component={FavoritosScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 28 }}>⭐</Text>
          ),
          tabBarLabel: 'Favoritos',
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 28 }}>👤</Text>
          ),
          tabBarLabel: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

// Componente interno que tiene acceso al tema
function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0A0A0A' : '#FFFFFF'}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#0A0A0A' },
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
          <Stack.Screen name="DetalleProducto" component={DetalleProductoScreen} /> 
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="GestionProductos" component={GestionProductosScreen} />
          <Stack.Screen name="GestionPedidos" component={GestionPedidosScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="ClientLogin" component={ClientLoginScreen} />
          <Stack.Screen name="MisPedidos" component={MisPedidosScreen} />
          <Stack.Screen name="MisDatos" component={MisDatosScreen} />  
          <Stack.Screen name="Configuracion" component={ConfiguracionScreen} />
          <Stack.Screen name="Terminos" component={TerminosScreen} />  
          <Stack.Screen name="Privacidad" component={PrivacidadScreen} /> 
          <Stack.Screen name="Ayuda" component={AyudaScreen} />
          <Stack.Screen name="ClientesAdmin" component={ClientesAdminScreen} />
          <Stack.Screen name="HistorialCliente" component={HistorialClienteScreen} />
          <Stack.Screen name="EstadisticasAdmin" component={EstadisticasAdminScreen} />
          <Stack.Screen name="AgregarProducto" component={AgregarProductoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}



// Navegación principal
export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CarritoProvider>
          <FavoritosProvider>
            <AppContent />
          </FavoritosProvider>
        </CarritoProvider>
      </UserProvider>
    </ThemeProvider>
  );
}