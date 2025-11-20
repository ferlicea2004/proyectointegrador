// components/ChatbotButton.js
// Botón flotante de chatbot con respuestas automáticas

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Linking,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function ChatbotButton() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const preguntas = [
    {
      id: 1,
      pregunta: '¿Cómo puedo hacer un pedido?',
      respuesta: 'Explora nuestro catálogo, agrega productos al carrito 🛒 y finaliza tu compra. Recibirás confirmación por email.'
    },
    {
      id: 2,
      pregunta: '¿Cuáles son los métodos de pago?',
      respuesta: 'Aceptamos transferencia bancaria y pago en efectivo contra entrega. Los detalles se proporcionan al finalizar la compra.'
    },
    {
      id: 3,
      pregunta: '¿Hacen envíos?',
      respuesta: 'Sí, realizamos envíos. El costo y tiempo de entrega se calculan según tu ubicación al momento de la compra.'
    },
    {
      id: 4,
      pregunta: '¿Qué es el mayoreo?',
      respuesta: 'El mayoreo son productos con precios especiales por volumen. Pedido mínimo de 6 productos. Encuentra estos productos en la pestaña Mayoreo 📦.'
    },
    {
      id: 5,
      pregunta: '¿Tienen garantía los productos?',
      respuesta: 'Todos nuestros productos cuentan con garantía. Los detalles específicos varían según el producto.'
    },
    {
      id: 6,
      pregunta: '¿Cómo puedo rastrear mi pedido?',
      respuesta: 'Ve a tu perfil 👤 → Mis Pedidos para ver el estado actual de tus compras.'
    },
    {
      id: 7,
      pregunta: 'Otra duda',
      respuesta: 'contacto'
    }
  ];

  const handleContacto = (tipo) => {
    if (tipo === 'instagram') {
      Linking.openURL('https://instagram.com/kraken.storemx');
    } else if (tipo === 'email') {
      Linking.openURL('mailto:krakenshopelectronicos@gmail.com');
    }
  };

  const styles = createStyles(theme);

  return (
    <>
      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonIcon}>💬</Text>
      </TouchableOpacity>

      {/* Modal del chatbot */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setVisible(false);
          setSelectedQuestion(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerIcon}>🤖</Text>
                <View>
                  <Text style={styles.headerTitle}>Asistente Kraken</Text>
                  <Text style={styles.headerSubtitle}>¿En qué puedo ayudarte?</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  setSelectedQuestion(null);
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              {!selectedQuestion ? (
                // Lista de preguntas
                <View style={styles.questionsContainer}>
                  <Text style={styles.questionsTitle}>Preguntas frecuentes:</Text>
                  {preguntas.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.questionButton}
                      onPress={() => setSelectedQuestion(item)}
                    >
                      <Text style={styles.questionIcon}>❓</Text>
                      <Text style={styles.questionText}>{item.pregunta}</Text>
                      <Text style={styles.questionArrow}>→</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                // Respuesta seleccionada
                <View style={styles.answerContainer}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setSelectedQuestion(null)}
                  >
                    <Text style={styles.backButtonText}>← Volver</Text>
                  </TouchableOpacity>

                  <View style={styles.questionCard}>
                    <Text style={styles.questionCardIcon}>❓</Text>
                    <Text style={styles.questionCardText}>{selectedQuestion.pregunta}</Text>
                  </View>

                  {selectedQuestion.respuesta === 'contacto' ? (
                    <View style={styles.contactContainer}>
                      <Text style={styles.answerText}>
                        Para dudas específicas, contáctanos por:
                      </Text>
                      
                      <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => handleContacto('instagram')}
                      >
                        <Text style={styles.contactButtonIcon}>📱</Text>
                        <View style={styles.contactButtonText}>
                          <Text style={styles.contactButtonTitle}>Instagram</Text>
                          <Text style={styles.contactButtonSubtitle}>@kraken.storemx</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => handleContacto('email')}
                      >
                        <Text style={styles.contactButtonIcon}>📧</Text>
                        <View style={styles.contactButtonText}>
                          <Text style={styles.contactButtonTitle}>Email</Text>
                          <Text style={styles.contactButtonSubtitle}>krakenshopelectronicos@gmail.com</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.answerCard}>
                      <Text style={styles.answerIcon}>💡</Text>
                      <Text style={styles.answerText}>{selectedQuestion.respuesta}</Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const createStyles = (theme) => StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 999,
  },
  floatingButtonIcon: {
    fontSize: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: theme.textTertiary,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: theme.textTertiary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  questionsContainer: {
    padding: 20,
  },
  questionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 15,
  },
  questionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  questionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: theme.text,
    fontWeight: '500',
  },
  questionArrow: {
    fontSize: 18,
    color: theme.primary,
    fontWeight: 'bold',
  },
  answerContainer: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
  },
  questionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.backgroundTertiary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  questionCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  questionCardText: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    fontWeight: '600',
  },
  answerCard: {
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  answerIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  answerText: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  contactContainer: {
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginTop: 10,
  },
  contactButtonIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  contactButtonText: {
    flex: 1,
  },
  contactButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 2,
  },
  contactButtonSubtitle: {
    fontSize: 13,
    color: theme.primary,
  },
});