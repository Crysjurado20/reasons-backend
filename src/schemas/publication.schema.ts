import { z } from 'zod';

const researcherArticleSchema = z.object({
  researcher_id: z.number().int().positive()
});

const publicationSchema = z.object({
  title: z.string({
    message: 'Title is required',
  }).min(1, 'Title cannot be empty'),
  
  abstract: z.string().optional().nullable(),
  cite: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  url_journal_cover: z.string().url('Must be a valid URL').optional().nullable(),
  
  researchers: z.array(researcherArticleSchema).optional()
});

export function validatePublication(input: unknown) {
  return publicationSchema.safeParse(input);
}

export function validatePartialPublication(input: unknown) {
  return publicationSchema.partial().safeParse(input);
}
