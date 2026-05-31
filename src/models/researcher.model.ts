import prisma from '../config/prisma';

export class ResearcherModel {
  static async getAll() {
    return await prisma.researchers.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        researcher_socials: {
          include: { social_networks: true }
        }
      }
    });
  }

  static async getById({ id }: { id: number }) {
    return await prisma.researchers.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
      include: {
        researcher_socials: {
          include: { social_networks: true }
        }
      }
    });
  }

  static async create({ input, createdBy }: { input: any, createdBy: number }) {
    return await prisma.researchers.create({
      data: {
        first_name: input.first_name,
        second_name: input.second_name,
        first_lastname: input.first_lastname,
        second_lastname: input.second_lastname,
        orcid_link: input.orcid_link,
        institutional_email: input.institutional_email,
        biography: input.biography,
        position: input.position,
        status: input.status,
        url_photo: input.url_photo,
        created_by: createdBy,
        researcher_socials: input.social_networks ? { create: input.social_networks } : undefined
      },
      include: {
        researcher_socials: { include: { social_networks: true } }
      }
    });
  }

  static async update({ id, input, modifiedBy }: { id: number, input: any, modifiedBy?: number }) {
    const existing = await prisma.researchers.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return null;

    if (input.social_networks) {
      await prisma.researcher_socials.deleteMany({ where: { researcher_id: Number(id) } });
    }

    return await prisma.researchers.update({
      where: {
        id: Number(id),
      },
      data: {
        first_name: input.first_name ?? existing.first_name,
        second_name: input.second_name ?? existing.second_name,
        first_lastname: input.first_lastname ?? existing.first_lastname,
        second_lastname: input.second_lastname ?? existing.second_lastname,
        orcid_link: input.orcid_link ?? existing.orcid_link,
        institutional_email: input.institutional_email ?? existing.institutional_email,
        biography: input.biography ?? existing.biography,
        position: input.position ?? existing.position,
        status: input.status ?? existing.status,
        url_photo: input.url_photo ?? existing.url_photo,
        modified_by: modifiedBy,
        modified_at: new Date(),
        researcher_socials: input.social_networks ? { create: input.social_networks } : undefined
      },
      include: {
        researcher_socials: { include: { social_networks: true } }
      }
    });
  }

  static async delete({ id, modifiedBy }: { id: number, modifiedBy?: number }) {
    const existing = await prisma.researchers.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return false;

    await prisma.researchers.update({
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
