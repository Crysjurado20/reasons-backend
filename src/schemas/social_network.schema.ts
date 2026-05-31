import { z } from 'zod';

const socialNetworkSchema = z.object({
  name: z.string({ message: 'Name is required' }).min(1, 'Name cannot be empty'),
  url_image: z.string().url('Must be a valid URL').optional().nullable(),
});

export function validateSocialNetwork(input: unknown) {
  return socialNetworkSchema.safeParse(input);
}

export function validatePartialSocialNetwork(input: unknown) {
  return socialNetworkSchema.partial().safeParse(input);
}
