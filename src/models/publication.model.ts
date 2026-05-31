import prisma from '../config/prisma';

export class PublicationModel {
  static async getAll() {
    return await prisma.articles.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        researcher_articles: {
          include: { researchers: true }
        }
      }
    });
  }

  static async getById({ id }: { id: number }) {
    return await prisma.articles.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
      include: {
        researcher_articles: {
          include: { researchers: true }
        }
      }
    });
  }

  static async create({ input, createdBy }: { input: any, createdBy: number }) {
    return await prisma.articles.create({
      data: {
        title: input.title,
        abstract: input.abstract,
        cite: input.cite,
        status: input.status,
        url_journal_cover: input.url_journal_cover,
        created_by: createdBy,
        researcher_articles: input.researchers ? { create: input.researchers } : undefined
      },
      include: {
        researcher_articles: { include: { researchers: true } }
      }
    });
  }

  static async update({ id, input, modifiedBy }: { id: number, input: any, modifiedBy?: number }) {
    const existing = await prisma.articles.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return null;

    if (input.researchers) {
      await prisma.researcher_articles.deleteMany({ where: { article_id: Number(id) } });
    }

    return await prisma.articles.update({
      where: {
        id: Number(id),
      },
      data: {
        title: input.title ?? existing.title,
        abstract: input.abstract ?? existing.abstract,
        cite: input.cite ?? existing.cite,
        status: input.status ?? existing.status,
        url_journal_cover: input.url_journal_cover ?? existing.url_journal_cover,
        modified_by: modifiedBy,
        modified_at: new Date(),
        researcher_articles: input.researchers ? { create: input.researchers } : undefined
      },
      include: {
        researcher_articles: { include: { researchers: true } }
      }
    });
  }

  static async delete({ id, modifiedBy }: { id: number, modifiedBy?: number }) {
    const existing = await prisma.articles.findFirst({
      where: {
        id: Number(id),
        deleted_at: null,
      },
    });

    if (!existing) return false;

    await prisma.articles.update({
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
