import { z } from 'zod';

const contactSchema = z.object({
  sender_name: z.string({ message: 'Sender name is required' }).min(1, 'Sender name cannot be empty'),
  sender_email: z.string({ message: 'Sender email is required' }).email('Invalid sender email format'),
  subject: z.string().optional().nullable(),
  institution: z.string().optional().nullable(),
  message: z.string({ message: 'Message is required' }).min(1, 'Message cannot be empty'),
});

export function validateContact(input: unknown) {
  return contactSchema.safeParse(input);
}
