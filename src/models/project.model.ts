import prisma from '../config/prisma';

export class ProjectModel {
  static async getAll() {
    return await prisma.projects.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      }
    });
  }

  static async getById({ id }: { id: number }) {
    return await prisma.projects.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });
  }

  static async create({ input, createdBy }: { input: any, createdBy: number }) {
    return await prisma.projects.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        created_by: createdBy
      }
    });
  }

  static async update({ id, input, modifiedBy }: { id: number, input: any, modifiedBy?: number }) {
    const existing = await prisma.projects.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return null;

    return await prisma.projects.update({
      where: {
        id: Number(id),
      },
      data: {
        title: input.title ?? existing.title,
        description: input.description ?? existing.description,
        status: input.status ?? existing.status,
        modified_by: modifiedBy,
        modified_at: new Date(),
      },
    });
  }

  static async delete({ id, modifiedBy }: { id: number, modifiedBy?: number }) {
    const existing = await prisma.projects.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return false;

    await prisma.projects.update({
      where: {
        id: Number(id),
      },
      data: {
        deleted_at: new Date(),
        modified_by: modifiedBy,
        modified_at: new Date(),
      },
    });

    return true;
  }
}