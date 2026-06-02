import prisma from '../config/prisma';
import { EmailService } from './email.service';

export class ContactRetryService {
  private static intervalId: NodeJS.Timeout | null = null;
  private static isProcessing = false;

  static start(intervalMs: number = 60000) { // Default to 1 minute
    if (this.intervalId) {
      console.warn('[ContactRetryService] El servicio de reintentos ya se está ejecutando.');
      return;
    }

    console.log(`[ContactRetryService] Iniciando servicio de reintentos cada ${intervalMs / 1000}s...`);
    this.intervalId = setInterval(() => this.processPendingMessages(), intervalMs);
    
    // Also run immediately on startup
    this.processPendingMessages();
  }

  static stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[ContactRetryService] Servicio de reintentos detenido.');
    }
  }

  static async processPendingMessages() {
    if (this.isProcessing) {
      console.log('[ContactRetryService] Ya hay un proceso de envío en ejecución. Ignorando este ciclo.');
      return;
    }

    this.isProcessing = true;
    try {
      // Find all messages that haven't been sent yet
      const pendingMessages = await prisma.contact_messages.findMany({
        where: {
          sent: false,
        },
        orderBy: {
          created_at: 'asc',
        },
      });

      if (pendingMessages.length === 0) {
        this.isProcessing = false;
        return;
      }

      console.log(`[ContactRetryService] Detectados ${pendingMessages.length} mensajes de contacto pendientes de envío.`);

      for (const msg of pendingMessages) {
        console.log(`[ContactRetryService] Intentando enviar mensaje ID: ${msg.id} de ${msg.sender_email}...`);
        
        const success = await EmailService.sendContactEmail({
          sender_name: msg.sender_name,
          sender_email: msg.sender_email,
          subject: msg.subject,
          institution: msg.institution,
          message: msg.message,
        });

        if (success) {
          await prisma.contact_messages.update({
            where: { id: msg.id },
            data: { sent: true },
          });
          console.log(`[ContactRetryService] Mensaje ID: ${msg.id} enviado y actualizado en la base de datos.`);
        } else {
          console.warn(`[ContactRetryService] Error al reenviar mensaje ID: ${msg.id}. Se volverá a intentar en el siguiente ciclo.`);
        }
      }
    } catch (error) {
      console.error('[ContactRetryService] Error durante el procesamiento de mensajes pendientes:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}
