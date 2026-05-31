import { z } from 'zod';

const specificObjectiveSchema = z.object({
  description: z.string().min(5, 'La descripción es muy corta')
});

const lineOfResearchSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(5, 'La descripción es muy corta')
});

const groupSchema = z.object({
  acronym: z.string({
    message: 'Acronym is required',
  }).min(1, 'Acronym cannot be empty'),

  name: z.string({
    message: 'Name is required',
  }).min(1, 'Name cannot be empty'),

  description: z.string({
    message: 'Description is required',
  }).min(1, 'Description cannot be empty'),
  
  general_objective: z.string({
    message: 'General objective is required',
  }).min(1, 'General objective cannot be empty'),
  
  domain: z.string({
    message: 'Domain is required',
  }).min(1, 'Domain cannot be empty'),
  
  email: z.string({
    message: 'Email is required',
  }).email('Invalid email format'),

  address: z.string({
    message: 'Address is required',
  }).min(1, 'Address cannot be empty'),

  url_logo: z.string().url('Must be a valid URL').optional().nullable(),
  
  specific_objectives: z.array(specificObjectiveSchema).optional(),
  lines_of_research: z.array(lineOfResearchSchema).optional()
});

export function validateGroup(input: unknown) {
  return groupSchema.safeParse(input);
}

export function validatePartialGroup(input: unknown) {
  return groupSchema.partial().safeParse(input);
}
