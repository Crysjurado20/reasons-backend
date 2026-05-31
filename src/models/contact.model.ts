import prisma from '../config/prisma';

export class ContactModel {
  static async getAll() {
    return await prisma.contact_messages.findMany({
      orderBy: {
        created_at: 'desc',
      }
    });
  }

  static async create({ input }: { input: any }) {
    return await prisma.contact_messages.create({
      data: {
        sender_name: input.sender_name,
        sender_email: input.sender_email,
        subject: input.subject,
        institution: input.institution,
        message: input.message
      }
    });
  }
}
