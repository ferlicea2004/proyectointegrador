// screens/PrivacidadScreen.js
// Pantalla de política de privacidad

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function PrivacidadScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidad</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introducción */}
        <View style={styles.section}>
          <Text style={styles.intro}>
            En Kraken Store respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política explica cómo recopilamos, usamos y protegemos tu información.
          </Text>
        </View>

        {/* Información que Recopilamos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 INFORMACIÓN QUE RECOPILAMOS</Text>
          
          <Text style={styles.subtitle}>Información Personal</Text>
          <Text style={styles.text}>
            Cuando creas una cuenta o realizas un pedido, recopilamos:{'\n\n'}
            • Nombre completo{'\n'}
            • Correo electrónico{'\n'}
            • Número de teléfono{'\n'}
            • Dirección de entrega{'\n'}
            • Información de compra (productos, montos, fechas)
          </Text>

          <Text style={styles.subtitle}>Información Automática</Text>
          <Text style={styles.text}>
            Al usar nuestra app, recopilamos automáticamente:{'\n\n'}
            • Tipo de dispositivo{'\n'}
            • Sistema operativo{'\n'}
            • Preferencias de la app{'\n'}
            • Productos favoritos{'\n'}
            • Historial de navegación en la app
          </Text>

          <Text style={styles.subtitle}>Información Opcional</Text>
          <Text style={styles.text}>
            • Cómo nos conociste (Instagram, recomendación, etc.){'\n'}
            • Notas adicionales en pedidos{'\n'}
            • Preferencias de comunicación
          </Text>
        </View>

        {/* Cómo Usamos tu Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 CÓMO USAMOS TU INFORMACIÓN</Text>
          
          <Text style={styles.text}>
            Usamos tus datos para:{'\n\n'}
            <Text style={styles.bold}>1. Procesar Pedidos</Text>
            {'\n• Confirmar y gestionar tus compras\n• Coordinar entregas\n• Procesar pagos\n• Enviar actualizaciones de estado\n\n'}
            <Text style={styles.bold}>2. Mejorar tu Experiencia</Text>
            {'\n• Recordar tus preferencias\n• Autocompletar datos en futuras compras\n• Personalizar recomendaciones\n• Mantener historial de pedidos\n\n'}
            <Text style={styles.bold}>3. Comunicación</Text>
            {'\n• Responder consultas y soporte\n• Enviar confirmaciones de pedido\n• Notificar sobre el estado de tu pedido\n• Compartir ofertas especiales (opcional)\n\n'}
            <Text style={styles.bold}>4. Seguridad y Prevención</Text>
            {'\n• Prevenir fraudes\n• Proteger la seguridad de la app\n• Cumplir con obligaciones legales'}
          </Text>
        </View>

        {/* Compartir Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 COMPARTIR TU INFORMACIÓN</Text>
          
          <Text style={styles.text}>
            <Text style={styles.bold}>NO vendemos ni rentamos</Text>
            {' tu información personal a terceros.\n\nSolo compartimos información con:\n\n'}
            <Text style={styles.bold}>• Servicios de Mensajería:</Text>
            {'\nPara coordinar entregas (solo nombre, teléfono y dirección)\n\n'}
            <Text style={styles.bold}>• Procesadores de Pago:</Text>
            {'\nSolo información necesaria para procesar transacciones\n\n'}
            <Text style={styles.bold}>• Autoridades:</Text>
            {'\nSi es requerido por ley o para proteger nuestros derechos'}
          </Text>
        </View>

        {/* Protección de Datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ PROTECCIÓN DE TUS DATOS</Text>
          
          <Text style={styles.text}>
            {'Implementamos medidas de seguridad para proteger tu información:\n\n• Encriptación de contraseñas\n• Conexiones seguras (HTTPS)\n• Almacenamiento seguro en servidores protegidos\n• Acceso restringido a información personal\n• Monitoreo constante de seguridad\n\n'}
            <Text style={styles.bold}>Nota:</Text>
            {' Ningún sistema es 100% seguro. Aunque tomamos todas las precauciones, no podemos garantizar seguridad absoluta.'}
          </Text>
        </View>

        {/* Tus Derechos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ TUS DERECHOS</Text>
          
          <Text style={styles.text}>
            {'Tienes derecho a:\n\n'}
            <Text style={styles.bold}>• Acceso:</Text>
            {' Conocer qué información tenemos sobre ti\n\n'}
            <Text style={styles.bold}>• Rectificación:</Text>
            {' Corregir datos incorrectos o desactualizados\n\n'}
            <Text style={styles.bold}>• Cancelación:</Text>
            {' Eliminar tu cuenta y datos personales\n\n'}
            <Text style={styles.bold}>• Oposición:</Text>
            {' Rechazar ciertos usos de tu información\n\n'}
            <Text style={styles.bold}>• Portabilidad:</Text>
            {' Obtener copia de tus datos\n\nPara ejercer estos derechos, contáctanos a:\nkrakenshopelectronicos@gmail.com'}
          </Text>
        </View>

        {/* Retención de Datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱️ RETENCIÓN DE DATOS</Text>
          
          <Text style={styles.text}>
            {'Conservamos tu información:\n\n'}
            <Text style={styles.bold}>Cuenta activa:</Text>
            {' Mientras uses la app\n'}
            <Text style={styles.bold}>Historial de pedidos:</Text>
            {' Por razones legales y contables (mínimo 5 años)\n'}
            <Text style={styles.bold}>Cuenta eliminada:</Text>
            {' Se borran datos personales, excepto registros de compra requeridos por ley'}
          </Text>
        </View>

        {/* Cookies y Tecnologías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍪 ALMACENAMIENTO LOCAL</Text>
          
          <Text style={styles.text}>
            Nuestra app almacena información localmente en tu dispositivo para:{'\n\n'}
            
            • Recordar tu sesión{'\n'}
            • Guardar preferencias (tema, vibración){'\n'}
            • Mantener carrito de compras{'\n'}
            • Almacenar favoritos{'\n\n'}
            
            Puedes borrar esta información desinstalando la app o limpiando el almacenamiento desde tu dispositivo.
          </Text>
        </View>

        {/* Menores de Edad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👶 MENORES DE EDAD</Text>
          
          <Text style={styles.text}>
            Nuestra app está dirigida a mayores de 18 años.{'\n\n'}
            
            No recopilamos intencionalmente información de menores de edad. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos inmediatamente.
          </Text>
        </View>

        {/* Cambios a la Política */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 CAMBIOS A ESTA POLÍTICA</Text>
          
          <Text style={styles.text}>
            Podemos actualizar esta política ocasionalmente.{'\n\n'}
            
            Te notificaremos sobre cambios importantes mediante:{'\n'}
            • Notificación en la app{'\n'}
            • Email{'\n'}
            • Aviso en redes sociales{'\n\n'}
            
            Te recomendamos revisar esta política periódicamente.
          </Text>
        </View>

        {/* Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 CONTACTO</Text>
          
          <Text style={styles.text}>
            Si tienes preguntas sobre esta política o el manejo de tus datos:{'\n\n'}
            
            <Text style={styles.bold}>Email:</Text> krakenshopelectronicos@gmail.com{'\n'}
            <Text style={styles.bold}>Instagram:</Text> @kraken.storemx{'\n\n'}
            
            Responderemos a tus consultas en un plazo de 5 días hábiles.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Última actualización: Noviembre 2025{'\n\n'}
            © 2025 Kraken Store. Todos los derechos reservados.{'\n\n'}
            Veracruz, Ver, México
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
  intro: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginTop: 15,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 22,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: theme.text,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: theme.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
});