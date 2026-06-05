import prisma from '../config/prisma';
import { EmailService } from '../services/email.service';

export class ContactModel {
  static async getAll() {
    return await prisma.contact_messages.findMany({
      orderBy: {
        created_at: 'desc',
      }
    });
  }

  static async create({ input }: { input: any }) {
    // 1. Guardar en la base de datos (con sent: false por defecto)
    const newMessage = await prisma.contact_messages.create({
      data: {
        sender_name: input.sender_name,
        sender_email: input.sender_email,
        subject: input.subject,
        institution: input.institution,
        message: input.message,
        sent: false
      }
    });

    // 2. Intentar enviar el correo de forma asíncrona de inmediato
    EmailService.sendContactEmail({
      sender_name: newMessage.sender_name,
      sender_email: newMessage.sender_email,
      subject: newMessage.subject,
      institution: newMessage.institution,
      message: newMessage.message
    }).then(async (success) => {
      if (success) {
        // 3. Si tiene éxito, actualizar en la base de datos a sent: true
        await prisma.contact_messages.update({
          where: { id: newMessage.id },
          data: { sent: true }
        });
        console.log(`[ContactModel] Mensaje ID: ${newMessage.id} enviado exitosamente y marcado como enviado.`);
      } else {
        console.warn(`[ContactModel] El envío del mensaje ID: ${newMessage.id} falló de inmediato. Queda pendiente para reintento.`);
      }
    }).catch((err) => {
      console.error(`[ContactModel] Excepción no controlada enviando correo de contacto ID: ${newMessage.id}:`, err);
    });

    // 4. Retornar el objeto creado inmediatamente
    return newMessage;
  }
}
