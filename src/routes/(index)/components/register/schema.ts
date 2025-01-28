import { z } from 'zod';

export const registerSchema = z
  .object({
    firstname: z.string().min(1, 'Must enter first name.'),
    middlename: z.string().min(1, 'Must enter middle name.'),
    lastname: z.string().min(1, 'Must enter last name.'),
    email: z.string().email('Must enter a valid email.'),
    password: z.string().min(8, 'Must enter a strong password.'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export type RegisterSchema = typeof registerSchema;
