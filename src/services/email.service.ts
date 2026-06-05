import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface ContactEmailInput {
  sender_name: string;
  sender_email: string;
  subject?: string | null;
  institution?: string | null;
  message: string;
}

export class EmailService {
  static async sendContactEmail(input: ContactEmailInput): Promise<boolean> {
    const receiver = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER;
    if (!receiver) {
      console.error('[EmailService] No se ha configurado un correo receptor (CONTACT_RECEIVER_EMAIL).');
      return false;
    }

    const subjectText = input.subject || 'Nuevo mensaje de contacto';
    
    // Sleek and modern premium HTML design
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subjectText}</title>
        <style>
          body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
            color: #1f2937;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
            border: 1px solid #e5e7eb;
          }
          .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            padding: 32px 24px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 32px 24px;
          }
          .field-group {
            margin-bottom: 24px;
            border-bottom: 1px solid #f3f4f6;
            padding-bottom: 16px;
          }
          .field-group:last-child {
            margin-bottom: 0;
            border-bottom: none;
            padding-bottom: 0;
          }
          .label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #6b7280;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .value {
            font-size: 16px;
            color: #111827;
            font-weight: 500;
          }
          .message-box {
            background-color: #f9fafb;
            border-left: 4px solid #3b82f6;
            padding: 16px;
            border-radius: 0 8px 8px 0;
            font-size: 15px;
            line-height: 1.6;
            color: #374151;
            white-space: pre-wrap;
          }
          .footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
          }
          .footer a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>REASONS — Portal de Investigación</h1>
            <p>Se ha recibido una nueva solicitud de contacto</p>
          </div>
          <div class="content">
            <div class="field-group">
              <div class="label">Remitente</div>
              <div class="value">${input.sender_name}</div>
            </div>
            
            <div class="field-group">
              <div class="label">Correo Electrónico</div>
              <div class="value"><a href="mailto:${input.sender_email}" style="color: #3b82f6; text-decoration: none;">${input.sender_email}</a></div>
            </div>
            
            ${input.institution ? `
            <div class="field-group">
              <div class="label">Institución / Organización</div>
              <div class="value">${input.institution}</div>
            </div>
            ` : ''}
            
            <div class="field-group">
              <div class="label">Asunto</div>
              <div class="value">${subjectText}</div>
            </div>
            
            <div class="field-group" style="border-bottom: none; padding-bottom: 0;">
              <div class="label">Mensaje</div>
              <div class="message-box">${input.message}</div>
            </div>
          </div>
          <div class="footer">
            <p>Este es un correo automático enviado por el Sistema de Gestión de Investigación de la UTA.</p>
            <p>&copy; ${new Date().getFullYear()} Universidad Técnica de Ambato. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: `"${input.sender_name} via REASONS" <${process.env.SMTP_USER}>`,
        to: receiver,
        replyTo: input.sender_email,
        subject: `[Contacto REASONS] ${subjectText}`,
        text: `Remitente: ${input.sender_name}\nCorreo: ${input.sender_email}\nInstitución: ${input.institution || 'No especificada'}\nAsunto: ${subjectText}\n\nMensaje:\n${input.message}`,
        html: htmlContent,
      });
      console.log(`[EmailService] Correo enviado exitosamente para ${input.sender_email}`);
      return true;
    } catch (error) {
      console.error(`[EmailService] Error al enviar correo de contacto a ${receiver}:`, error);
      return false;
    }
  }
}
