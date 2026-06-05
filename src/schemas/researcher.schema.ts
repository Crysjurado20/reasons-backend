import { z } from 'zod';

const researcherSocialSchema = z.object({
  social_network_id: z.number().int().positive(),
  link_social: z.string().url('Must be a valid URL')
});

const researcherSchema = z.object({
  first_name: z.string({ message: 'First name is required' }).min(1, 'First name cannot be empty'),
  second_name: z.string().optional().nullable(),
  first_lastname: z.string({ message: 'First lastname is required' }).min(1, 'First lastname cannot be empty'),
  second_lastname: z.string().optional().nullable(),
  orcid_link: z.string().url('Must be a valid URL').optional().nullable(),
  institutional_email: z.string().email('Must be a valid email').optional().nullable(),
  biography: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  url_photo: z.string().url('Must be a valid URL').optional().nullable(),
  
  social_networks: z.array(researcherSocialSchema).optional()
});

export function validateResearcher(input: unknown) {
  return researcherSchema.safeParse(input);
}

export function validatePartialResearcher(input: unknown) {
  return researcherSchema.partial().safeParse(input);
}
