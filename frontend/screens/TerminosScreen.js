// screens/TerminosScreen.js
// Pantalla de términos, condiciones y garantías

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function TerminosScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Términos y Condiciones</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introducción */}
        <View style={styles.section}>
          <Text style={styles.intro}>
            Al realizar una compra en Kraken Store, aceptas los siguientes términos y condiciones de venta.
          </Text>
        </View>

        {/* Políticas de Venta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 POLÍTICAS DE VENTA</Text>
          
          <Text style={styles.subtitle}>1. Pedidos y Confirmación</Text>
          <Text style={styles.text}>
            • Todos los pedidos están sujetos a disponibilidad de stock{'\n'}
            • Recibirás confirmación de tu pedido vía WhatsApp o email{'\n'}
            • Los precios pueden variar sin previo aviso{'\n'}
            • Las imágenes son ilustrativas
          </Text>

          <Text style={styles.subtitle}>2. Métodos de Pago</Text>
          <Text style={styles.text}>
            • Transferencia bancaria{'\n'}
            • Depósito en efectivo{'\n'}
            • Pago contra entrega (según disponibilidad){'\n'}
            • El pedido se procesa una vez confirmado el pago
          </Text>

          <Text style={styles.subtitle}>3. Envíos y Entregas</Text>
          <Text style={styles.text}>
            • Tiempo de entrega: 3-5 días hábiles{'\n'}
            • Los gastos de envío se calculan según la ubicación{'\n'}
            • Entregas locales disponibles en Veracruz, Ver.{'\n'}
            • El cliente es responsable de verificar el paquete al recibirlo
          </Text>
        </View>

        {/* Garantías */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ POLÍTICAS DE GARANTÍA</Text>
          
          <View style={styles.garantiaCard}>
            <Text style={styles.garantiaTipo}>GARANTÍA TIPO: 30 Días</Text>
            <Text style={styles.garantiaDescripcion}>
              Aplica para todos los productos.{'\n\n'}
              
              <Text style={styles.bold}>Cobertura:</Text>{'\n'}
              • Sin garantía contra defectos de fábrica{'\n'}
              • Cambio a eleccion del cliente{'\n'}
              • No aplica para daños físicos, líquidos o mal uso{'\n\n'}

              <Text style={styles.bold}>Condiciones:</Text>{'\n'}
              • Producto en condiciones originales{'\n'}
              • Empaque y accesorios completos{'\n'}
              • Comprobante de compra{'\n'}
              • Sin alteraciones ni reparaciones previas{'\n\n'}
              
              <Text style={styles.bold}>Recomendación:</Text>{'\n'}
              Revisa el producto al recibirlo. Cualquier daño debe reportarse inmediatamente.
            </Text>
          </View>
        </View>

        {/* Excepciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ EXCEPCIONES DE GARANTÍA</Text>
          <Text style={styles.text}>
            Las garantías NO cubren:{'\n\n'}
            • Daños por caídas, golpes o maltrato{'\n'}
            • Daños por líquidos{'\n'}
            • Desgaste normal por uso{'\n'}
            • Modificaciones o reparaciones no autorizadas{'\n'}
            • Uso indebido o negligencia{'\n'}
            • Daños estéticos superficiales{'\n'}
            • Pérdida o robo del producto
          </Text>
        </View>

        {/* Proceso de Garantía */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 PROCESO DE GARANTÍA</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>1. Contacto:</Text> Escríbenos vía WhatsApp o email dentro del período de garantía{'\n\n'}
            <Text style={styles.bold}>2. Evaluación:</Text> Revisaremos tu caso y solicitaremos fotos/videos del problema{'\n\n'}
            <Text style={styles.bold}>3. Autorización:</Text> Si procede, te indicaremos los pasos siguientes{'\n\n'}
            <Text style={styles.bold}>4. Resolución:</Text> Cambio del producto o reembolso según el tipo de garantía{'\n\n'}
            {'Tiempo estimado de resolución: 5-10 días hábiles'}
          </Text>
        </View>

        {/* Cambios y Devoluciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>↩️ CAMBIOS Y DEVOLUCIONES</Text>
          <Text style={styles.text}>
            • Los cambios solo aplican dentro del período de garantía{'\n'}
            • No se aceptan devoluciones por cambio de opinión en productos sin garantía{'\n'}
            • Los gastos de envío para cambios corren por cuenta del cliente{'\n'}
            • Reembolsos procesados en 5-10 días hábiles
          </Text>
        </View>

        {/* Contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 CONTACTO</Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Instagram:</Text> @kraken.storemx{'\n'}
            <Text style={styles.bold}>Email:</Text> krakenshopelectronicos@gmail.com{'\n\n'}
            {'Horario de atención:\n'}
            {'Lunes a Viernes: 10:00 AM - 8:00 PM\n'}
            {'Sábados: 10:00 AM - 2:00 PM'}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Última actualización: Noviembre 2025{'\n\n'}
            © 2025 Kraken Store. Todos los derechos reservados.
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
  garantiaCard: {
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  garantiaTipo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 10,
  },
  garantiaDescripcion: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 22,
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