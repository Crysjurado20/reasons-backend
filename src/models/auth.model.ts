import prisma from '../config/prisma';

export class AuthModel {
  static async getUserByEmail({ email }: { email: string }) {
    return await prisma.users.findUnique({
      where: {
        email,
      },
    });
  }

  static async getUserById({ id }: { id: number }) {
    return await prisma.users.findFirst({
      where: {
        id,
        deleted_at: null
      },
    });
  }

  static async updateUserToken({ id, token }: { id: number, token: string }) {
    return await prisma.users.update({
      where: { id },
      data: { token },
    });
  }
}
