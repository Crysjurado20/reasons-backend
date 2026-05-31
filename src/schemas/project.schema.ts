import { z } from 'zod';

const objectiveSchema = z.object({
  description: z.string().min(5, 'La descripción es muy corta')
});

const resultSchema = z.object({
  description: z.string().min(5, 'La descripción es muy corta')
});

const researcherProjectSchema = z.object({
  researcher_id: z.number().int().positive()
});

const projectSchema = z.object({
  title: z.string({
    message: 'Title is required',
  }).min(1, 'Title cannot be empty'),
  
  description: z.string().optional(),
  
  status: z.enum(['ACTIVE', 'INACTIVE', 'COMPLETED']).default('ACTIVE'),

  objectives: z.array(objectiveSchema).optional(),
  results: z.array(resultSchema).optional(),
  researchers: z.array(researcherProjectSchema).optional()
});

export function validateProject(input: unknown) {
  return projectSchema.safeParse(input);
}

export function validatePartialProject(input: unknown) {
  return projectSchema.partial().safeParse(input);
}