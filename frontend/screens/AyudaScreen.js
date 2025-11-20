// screens/AyudaScreen.js
// Pantalla de centro de ayuda y preguntas frecuentes

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import * as Clipboard from 'expo-clipboard';

export default function AyudaScreen({ navigation }) {
  const { theme } = useTheme();
  const [expandido, setExpandido] = useState(null);

  const togglePregunta = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  const handleContacto = () => {
    Alert.alert(
      '💬 Contáctanos',
      'Elige cómo quieres comunicarte:',
      [
        {
          text: '📸 Instagram',
          onPress: async () => {
            try {
              await Linking.openURL('https://www.instagram.com/kraken.storemx/');
            } catch (error) {
              Alert.alert('Instagram', '@kraken.storemx');
            }
          },
        },
        {
          text: '📧 Email',
          onPress: async () => {
            const email = 'krakenshopelectronicos@gmail.com';
            await Clipboard.setStringAsync(email);
            Alert.alert('✅ Email copiado', `${email}\n\nCopiado al portapapeles`);
          },
        },
        { text: 'Cerrar', style: 'cancel' },
      ]
    );
  };

  const preguntas = [
    {
      id: 1,
      seccion: '📦 SOBRE PEDIDOS',
      items: [
        {
          pregunta: '¿Cómo hago un pedido?',
          respuesta:
            '1. Explora productos en "Tienda" o "Mayoreo"\n2. Toca un producto para ver detalles\n3. Selecciona cantidad y "Agregar al Carrito"\n4. Ve al carrito y toca "Proceder al pago"\n5. Completa tus datos y confirma\n6. Nos pondremos en contacto contigo para coordinar la entrega y pago',
        },
        {
          pregunta: '¿Cuánto tarda la entrega?',
          respuesta:
            'El tiempo de entrega depende de tu ubicación:\n\n• Veracruz ciudad: 1-2 días\n• Otras ciudades en Veracruz: 3-5 días\n• Envíos foráneos: 5-7 días\n\nTe confirmaremos el tiempo exacto al procesar tu pedido.',
        },
        {
          pregunta: '¿Puedo cancelar mi pedido?',
          respuesta:
            'Sí, puedes cancelar tu pedido si:\n\n• Aún no ha sido enviado\n• No se ha procesado el pago\n• Nos contactas dentro de las primeras 24 horas\n\nContáctanos vía WhatsApp o Instagram para cancelar.',
        },
        {
          pregunta: '¿Cómo rastreo mi pedido?',
          respuesta:
            'Una vez confirmado tu pedido:\n\n1. Recibirás un número de pedido\n2. Podrás verlo en "Perfil → Mis Pedidos"\n3. Te notificaremos por WhatsApp cuando sea enviado\n4. Recibirás actualizaciones del estado de entrega',
        },
      ],
    },
    {
      id: 2,
      seccion: '💳 SOBRE PAGOS',
      items: [
        {
          pregunta: '¿Qué métodos de pago aceptan?',
          respuesta:
            'Aceptamos los siguientes métodos:\n\n• Transferencia bancaria\n• Depósito en efectivo\n• Pago contra entrega (según disponibilidad y ubicación)\n\nTe indicaremos las opciones disponibles al confirmar tu pedido.',
        },
        {
          pregunta: '¿Es seguro pagar?',
          respuesta:
            'Sí, tu pago es 100% seguro:\n\n• No guardamos información bancaria\n• Usamos canales oficiales de pago\n• Recibirás comprobante de cada transacción\n• Tu información está protegida\n\nNunca pedimos datos sensibles por redes sociales.',
        },
        {
          pregunta: '¿Puedo pagar contra entrega?',
          respuesta:
            'El pago contra entrega está disponible para:\n\n• Entregas locales en Veracruz ciudad\n• Pedidos menores a $2,000\n• Clientes con historial de compras\n\nConsulta disponibilidad al hacer tu pedido.',
        },
      ],
    },
    {
      id: 3,
      seccion: '🛡️ SOBRE GARANTÍAS',
      items: [
        {
          pregunta: '¿Qué productos tienen garantía?',
          respuesta:
            'Tenemos 3 tipos de garantía:\n\n• Sin garantía: Productos OEM\n• 15 días: Productos de gama media\n• 30 días: Productos premium y originales\n\nLa garantía de cada producto se indica en su descripción.',
        },
        {
          pregunta: '¿Cómo reclamo la garantía?',
          respuesta:
            'Para hacer válida tu garantía:\n\n1. Contáctanos vía WhatsApp o Instagram\n2. Envía fotos/videos del problema\n3. Indica tu número de pedido\n4. Evaluaremos tu caso en 24-48 horas\n5. Te indicaremos los pasos a seguir\n\nLa garantía NO cubre daños físicos o mal uso.',
        },
        {
          pregunta: '¿Puedo devolver un producto?',
          respuesta:
            'Las devoluciones aplican solo si:\n\n• El producto tiene defecto de fábrica\n• Está dentro del período de garantía\n• Conservas empaque y accesorios originales\n• No presenta daños físicos\n\nNo aceptamos devoluciones por cambio de opinión en productos sin garantía.',
        },
      ],
    },
    {
      id: 4,
      seccion: '📱 SOBRE LA APP',
      items: [
        {
          pregunta: '¿Cómo funciona el carrito?',
          respuesta:
            'El carrito es muy fácil de usar:\n\n• Agrega productos desde cualquier pantalla\n• Los productos se guardan aunque cierres la app\n• Puedes modificar cantidades en el carrito\n• Elimina productos deslizando o tocando el ícono de basura\n• El total se actualiza automáticamente',
        },
        {
          pregunta: '¿Cómo guardo favoritos?',
          respuesta:
            'Para guardar productos favoritos:\n\n1. Toca el corazón (🤍) en cualquier producto\n2. Se guardará automáticamente\n3. Accede desde el tab "Favoritos"\n4. Toca de nuevo para quitar de favoritos\n\nTus favoritos se mantienen aunque cierres la app.',
        },
        {
          pregunta: '¿Qué es mayoreo?',
          respuesta:
            'El mayoreo ofrece precios especiales:\n\n• Pedido mínimo: 6 productos\n• Precios más bajos por volumen\n• Puedes mezclar diferentes productos\n• Ideal para revendedores\n\nNavega en el tab "Mayoreo" para ver los productos disponibles.',
        },
        {
          pregunta: '¿Necesito crear una cuenta?',
          respuesta:
            'No es obligatorio, pero tiene ventajas:\n\n✅ Con cuenta:\n• Tus datos se guardan automáticamente\n• Puedes ver tu historial de pedidos\n• Checkout más rápido\n\n❌ Sin cuenta (invitado):\n• Debes llenar tus datos cada vez\n• No guardas historial\n\nPuedes comprar de ambas formas.',
        },
      ],
    },
  ];

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Centro de Ayuda</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={styles.intro}>
          <Text style={styles.introIcon}>💡</Text>
          <Text style={styles.introTitle}>¿En qué podemos ayudarte?</Text>
          <Text style={styles.introText}>
            Encuentra respuestas a las preguntas más frecuentes sobre Kraken Store
          </Text>
        </View>

        {/* Preguntas por sección */}
        {preguntas.map((seccion) => (
          <View key={seccion.id} style={styles.seccion}>
            <Text style={styles.seccionTitulo}>{seccion.seccion}</Text>

            {seccion.items.map((item, index) => (
              <View key={index} style={styles.preguntaCard}>
                <TouchableOpacity
                  style={styles.preguntaHeader}
                  onPress={() => togglePregunta(`${seccion.id}-${index}`)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.preguntaTexto}>{item.pregunta}</Text>
                  <Text style={styles.preguntaIcono}>
                    {expandido === `${seccion.id}-${index}` ? '−' : '+'}
                  </Text>
                </TouchableOpacity>

                {expandido === `${seccion.id}-${index}` && (
                  <View style={styles.respuestaContainer}>
                    <Text style={styles.respuestaTexto}>{item.respuesta}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Contacto */}
        <View style={styles.contactoCard}>
          <Text style={styles.contactoIcon}>📞</Text>
          <Text style={styles.contactoTitulo}>¿No encontraste tu respuesta?</Text>
          <Text style={styles.contactoTexto}>
            Estamos aquí para ayudarte. Contáctanos directamente:
          </Text>

          <TouchableOpacity style={styles.contactoButton} onPress={handleContacto}>
            <Text style={styles.contactoButtonText}>Contactar soporte</Text>
          </TouchableOpacity>

          <View style={styles.horario}>
            <Text style={styles.horarioTexto}>
              📅 Lunes a Viernes: 10:00 AM - 8:00 PM{'\n'}
              📅 Sábados: 10:00 AM - 2:00 PM
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿Quieres conocer más sobre nuestras políticas?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Terminos')}>
            <Text style={styles.footerLink}>Ver términos y condiciones</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Privacidad')}>
            <Text style={styles.footerLink}>Ver política de privacidad</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    intro: {
      alignItems: 'center',
      padding: 30,
      paddingBottom: 20,
    },
    introIcon: {
      fontSize: 50,
      marginBottom: 15,
    },
    introTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    introText: {
      fontSize: 14,
      color: theme.textTertiary,
      textAlign: 'center',
      lineHeight: 20,
    },
    seccion: {
      paddingHorizontal: 20,
      marginBottom: 25,
    },
    seccionTitulo: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    preguntaCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    preguntaHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    preguntaTexto: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: theme.text,
      marginRight: 10,
    },
    preguntaIcono: {
      fontSize: 24,
      color: theme.primary,
      fontWeight: 'bold',
    },
    respuestaContainer: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      paddingTop: 5,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    respuestaTexto: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 22,
    },
    contactoCard: {
      margin: 20,
      marginTop: 10,
      padding: 25,
      backgroundColor: theme.card,
      borderRadius: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    contactoIcon: {
      fontSize: 50,
      marginBottom: 15,
    },
    contactoTitulo: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    contactoTexto: {
      fontSize: 14,
      color: theme.textTertiary,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
    },
    contactoButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 30,
      paddingVertical: 14,
      borderRadius: 10,
      marginBottom: 20,
    },
    contactoButtonText: {
      color: '#0A0A0A',
      fontSize: 16,
      fontWeight: 'bold',
    },
    horario: {
      backgroundColor: theme.backgroundTertiary,
      padding: 15,
      borderRadius: 10,
      width: '100%',
    },
    horarioTexto: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    footer: {
      alignItems: 'center',
      padding: 30,
      paddingTop: 10,
    },
    footerText: {
      fontSize: 13,
      color: theme.textTertiary,
      marginBottom: 15,
      textAlign: 'center',
    },
    footerLink: {
      fontSize: 14,
      color: theme.primary,
      fontWeight: '600',
      marginBottom: 10,
    },
  });