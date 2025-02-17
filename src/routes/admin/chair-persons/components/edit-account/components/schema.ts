import { z } from 'zod';

export const editEmailSchema = z.object({
  user_id: z.string(),
  email: z.string().email('Must enter valid email.')
});

export const editInformationSchema = z.object({
  user_id: z.string(),
  firstname: z.string().min(1, 'Must enter first name.'),
  middlename: z.string().min(1, 'Must enter middle name.'),
  lastname: z.string().min(1, 'Must enter last name.'),
  birth_date: z.string().min(1, 'Must enter birth date.'),
  gender: z.string().min(1, 'Must select gender.'),
  academic_rank: z.string().min(1, 'Must enter academic rank.'),
  departments: z.array(z.number()).min(1, 'Must select at least one department.'),
  status: z.string().min(1, 'Must enter status.')
});

export const editPasswordSchema = z
  .object({
    user_id: z.string(),
    password: z.string().min(8, 'Must enter a valid password.'),
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

export type EditEmailSchema = typeof editEmailSchema;
export type EditInformationSchema = typeof editInformationSchema;
export type EditPasswordSchema = typeof editPasswordSchema;
