import prisma from '../config/prisma';

export class ProjectModel {
  static async getAll() {
    return await prisma.projects.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        objectives: { where: { deleted_at: null } },
        results: { where: { deleted_at: null } },
        researcher_projects: {
          include: { researchers: true }
        }
      }
    });
  }

  static async getById({ id }: { id: number }) {
    return await prisma.projects.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
      include: {
        objectives: { where: { deleted_at: null } },
        results: { where: { deleted_at: null } },
        researcher_projects: {
          include: { researchers: true }
        }
      }
    });
  }

  static async create({ input, createdBy }: { input: any, createdBy: number }) {
    return await prisma.projects.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        created_by: createdBy,
        objectives: input.objectives ? { create: input.objectives } : undefined,
        results: input.results ? { create: input.results } : undefined,
        researcher_projects: input.researchers ? { create: input.researchers } : undefined
      },
      include: {
        objectives: true,
        results: true,
        researcher_projects: { include: { researchers: true } }
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

    if (input.objectives) {
      await prisma.objectives.deleteMany({ where: { project_id: Number(id) } });
    }
    if (input.results) {
      await prisma.results.deleteMany({ where: { project_id: Number(id) } });
    }
    if (input.researchers) {
      await prisma.researcher_projects.deleteMany({ where: { project_id: Number(id) } });
    }

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
        objectives: input.objectives ? { create: input.objectives } : undefined,
        results: input.results ? { create: input.results } : undefined,
        researcher_projects: input.researchers ? { create: input.researchers } : undefined
      },
      include: {
        objectives: true,
        results: true,
        researcher_projects: { include: { researchers: true } }
      }
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