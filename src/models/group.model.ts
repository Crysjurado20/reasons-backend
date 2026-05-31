import prisma from '../config/prisma';

export class GroupModel {
  static async getAll() {
    return await prisma.groups.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        specific_objectives: { where: { deleted_at: null } },
        lines_of_research: { where: { deleted_at: null } }
      }
    });
  }

  static async getStats() {
    const projectsCount = await prisma.projects.count({ where: { deleted_at: null } });
    const researchersCount = await prisma.researchers.count({ where: { deleted_at: null } });
    const publicationsCount = await prisma.articles.count({ where: { deleted_at: null } });

    return {
      projects: projectsCount,
      researchers: researchersCount,
      publications: publicationsCount
    };
  }

  static async getById({ id }: { id: number }) {
    return await prisma.groups.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
      include: {
        specific_objectives: { where: { deleted_at: null } },
        lines_of_research: { where: { deleted_at: null } }
      }
    });
  }

  static async create({ input, createdBy }: { input: any, createdBy: number }) {
    return await prisma.groups.create({
      data: {
        acronym: input.acronym,
        name: input.name,
        description: input.description,
        general_objective: input.general_objective,
        domain: input.domain,
        url_logo: input.url_logo,
        email: input.email,
        address: input.address,
        created_by: createdBy,
        specific_objectives: input.specific_objectives ? {
          create: input.specific_objectives
        } : undefined,
        lines_of_research: input.lines_of_research ? {
          create: input.lines_of_research
        } : undefined
      },
      include: {
        specific_objectives: true,
        lines_of_research: true
      }
    });
  }

  static async update({ id, input, modifiedBy }: { id: number, input: any, modifiedBy?: number }) {
    const existing = await prisma.groups.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return null;

    if (input.specific_objectives) {
      await prisma.specific_objectives.deleteMany({ where: { group_id: Number(id) } });
    }
    if (input.lines_of_research) {
      await prisma.lines_of_research.deleteMany({ where: { group_id: Number(id) } });
    }

    return await prisma.groups.update({
      where: {
        id: Number(id),
      },
      data: {
        acronym: input.acronym ?? existing.acronym,
        name: input.name ?? existing.name,
        description: input.description ?? existing.description,
        general_objective: input.general_objective ?? existing.general_objective,
        domain: input.domain ?? existing.domain,
        url_logo: input.url_logo ?? existing.url_logo,
        email: input.email ?? existing.email,
        address: input.address ?? existing.address,
        modified_by: modifiedBy,
        modified_at: new Date(),
        specific_objectives: input.specific_objectives ? {
          create: input.specific_objectives
        } : undefined,
        lines_of_research: input.lines_of_research ? {
          create: input.lines_of_research
        } : undefined
      },
      include: {
        specific_objectives: true,
        lines_of_research: true
      }
    });
  }

  static async delete({ id, modifiedBy }: { id: number, modifiedBy?: number }) {
    const existing = await prisma.groups.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return false;

    await prisma.groups.update({
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
