import { z } from 'zod';

// Definimos la forma exacta que debe tener un Proyecto
const projectSchema = z.object({
  title: z.string({
    message: 'Title is required',
  }).min(1, 'Title cannot be empty'),
  
  description: z.string().optional(),
  
  status: z.enum(['ACTIVE', 'INACTIVE', 'COMPLETED']).default('ACTIVE'),
  
});

export function validateProject(input: unknown) {
  return projectSchema.safeParse(input);
}

export function validatePartialProject(input: unknown) {
  return projectSchema.partial().safeParse(input);
}