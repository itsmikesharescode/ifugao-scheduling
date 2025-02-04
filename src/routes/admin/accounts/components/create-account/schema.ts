import { z } from 'zod';

export const createAccountSchema = z
  .object({
    email: z.string().email('Must enter a valid email.'),
    firstname: z.string().min(1, 'Must enter first name.'),
    middlename: z.string().min(1, 'Must enter middle name.'),
    lastname: z.string().min(1, 'Must enter last name.'),
    birth_date: z.string().min(1, 'Must enter birth date.'),
    gender: z.string().min(1, 'Must select gender.'),
    academic_rank: z.string().min(1, 'Must enter academic rank.'),
    department: z.string().min(1, 'Must enter department.'),
    status: z.string().min(1, 'Must enter status.'),
    password: z.string().min(8, 'Must enter a strong password.'),
    confirmPassword: z.string()
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Must confirm password.',
        path: ['confirmPassword']
      });
    }
  });

export type CreateAccountSchema = typeof createAccountSchema;
