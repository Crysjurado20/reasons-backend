import prisma from '../config/prisma';

export class SocialNetworkModel {
  static async getAll() {
    return await prisma.social_networks.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        name: 'asc',
      }
    });
  }

  static async getById({ id }: { id: number }) {
    return await prisma.social_networks.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });
  }

  static async create({ input }: { input: any }) {
    return await prisma.social_networks.create({
      data: {
        name: input.name,
        url_image: input.url_image
      }
    });
  }

  static async update({ id, input }: { id: number, input: any }) {
    const existing = await prisma.social_networks.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return null;

    return await prisma.social_networks.update({
      where: {
        id: Number(id),
      },
      data: {
        name: input.name ?? existing.name,
        url_image: input.url_image ?? existing.url_image,
      },
    });
  }

  static async delete({ id }: { id: number }) {
    const existing = await prisma.social_networks.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return false;

    // Borrado lógico (soft delete)
    await prisma.social_networks.update({
      where: {
        id: Number(id),
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return true;
  }
}
